import { workoutSchema, type WorkoutType } from '@/models/Workout'
import DB, { Database } from '@/services/db'
import { StatusEnum, TableEnum } from '@/shared/enums'
import { databaseIcon, workoutsPageIcon } from '@/shared/icons'
import type { IdType, SelectOption } from '@/shared/types'
import { hiddenTableColumn, tableColumn, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Workout model.
 */
export class WorkoutService extends BaseService {
    private static _instance: WorkoutService | null = null

    private constructor(public db: Database) {
        super()
    }

    static getSingleton(db: Database = DB): WorkoutService {
        if (!WorkoutService._instance) {
            WorkoutService._instance = new WorkoutService(db)
        }
        return WorkoutService._instance
    }

    labelSingular = 'Workout'
    labelPlural = 'Workouts'
    modelSchema = workoutSchema
    table = TableEnum.WORKOUTS
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('name', 'Name', 'TEXT'),
        tableColumn('desc', 'Description', 'TEXT'),
        tableColumn('status', 'Status', 'LIST-PRINT'),
        tableColumn('lastChild', 'Last Workout Result', 'JSON'),
        tableColumn('warmupGroups', 'Warmup Exercises', 'JSON'),
        tableColumn('exerciseGroups', 'Main Exercises', 'JSON'),
        tableColumn('cooldownGroups', 'Cooldown Exercises', 'JSON'),
        tableColumn('nextWorkoutIds', 'Next records', 'LIST-PRINT'),
    ]
    displayIcon = workoutsPageIcon
    tableIcon = databaseIcon
    supportsTableColumnFilters = true
    supportsTableCharts = false
    supportsCharts = true
    supportsInspect = true
    supportsCreate = true
    supportsEdit = true
    supportsDelete = true
    chartsDialogProps = null! // TODO
    inspectDialogProps = null! // TODO
    createDialogProps = null! // TODO
    editDialogProps = null! // TODO
    deleteDialogProps = null! // TODO

    /**
     * Returns records live query with records that are not deactivated with the remaining sorted
     * with locked records first, then favorited records, then alphabetically by name, and finally
     * by createdAt reversed.
     */
    liveDashboardObservable(): Observable<WorkoutType[]> {
        return liveQuery(() =>
            this.db
                .table(TableEnum.WORKOUTS)
                .orderBy('name')
                .filter((record) => !record.status.includes(StatusEnum.DEACTIVATED))
                .toArray()
                .then((records) =>
                    records.sort((a, b) => {
                        // Locked records come first to indicate they are active in some way
                        const aIsLocked = a.status.includes(StatusEnum.LOCKED)
                        const bIsLocked = b.status.includes(StatusEnum.LOCKED)

                        if (aIsLocked && !bIsLocked) {
                            return -1 // a comes first
                        }
                        if (!aIsLocked && bIsLocked) {
                            return 1 // b comes first
                        }

                        const aIsFavorited = a.status.includes(StatusEnum.FAVORITED)
                        const bIsFavorited = b.status.includes(StatusEnum.FAVORITED)

                        if (aIsFavorited && !bIsFavorited) {
                            return -1 // a comes first
                        }

                        if (!aIsFavorited && bIsFavorited) {
                            return 1 // b comes first
                        }

                        // If both or neither are favorited, sort alphabetically by name
                        const nameComparison = a.name.localeCompare(b.name)
                        if (nameComparison !== 0) {
                            return nameComparison
                        }

                        // If names are identical, sort by createdAt reversed (b - a)
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    }),
                ),
        )
    }

    /**
     * Returns records live query ordered by name.
     */
    liveObservable(): Observable<WorkoutType[]> {
        return liveQuery(() => this.db.table(TableEnum.WORKOUTS).orderBy('name').toArray())
    }

    /**
     * Returns record by ID.
     */
    async get(id: IdType): Promise<WorkoutType> {
        const recordToGet = await this.db.table(TableEnum.WORKOUTS).get(id)
        if (!recordToGet) {
            throw new Error(`Workout ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new record in the database.
     */
    async add(record: WorkoutType): Promise<WorkoutType> {
        const validatedRecord = workoutSchema.parse(record)
        await this.db.table(TableEnum.WORKOUTS).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a record in the database.
     */
    async put(record: WorkoutType): Promise<WorkoutType> {
        const validatedRecord = workoutSchema.parse(record)
        await this.db.table(TableEnum.WORKOUTS).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the record by id and all associated child records from the database.
     */
    async remove(id: IdType): Promise<WorkoutType> {
        const recordToDelete = await this.db.table(TableEnum.WORKOUTS).get(id)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.WORKOUTS),
            this.db.table(TableEnum.WORKOUT_RESULTS),
            async () => {
                await this.db.table(TableEnum.WORKOUTS).delete(id)
                await this.db
                    .table(TableEnum.WORKOUT_RESULTS)
                    .where('workoutId')
                    .equals(id)
                    .delete()
            },
        )
        return recordToDelete
    }

    /**
     * Imports records into the database using put and returns a results object.
     */
    async importData(records: WorkoutType[]) {
        const validRecords: WorkoutType[] = []
        const invalidRecords: Partial<WorkoutType>[] = []

        // Validate each record
        records.forEach((workout) => {
            if (workoutSchema.safeParse(workout).success) {
                validRecords.push(workoutSchema.parse(workout)) // Clean record with parse
            } else {
                invalidRecords.push(workout)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await this.db.table(TableEnum.WORKOUTS).bulkAdd(validRecords)
        } catch (error) {
            bulkError = {
                name: (error as Error)?.name,
                message: (error as Error)?.message,
            }
        }

        // Return results object for FE handling
        return {
            validRecords,
            invalidRecords,
            importedCount: validRecords.length,
            bulkError,
        }
    }

    /**
     * Custom export operation for fetching all records from the database with unneeded fields
     * removed.
     */
    async exportData() {
        const records = await this.db.table(TableEnum.WORKOUTS).toArray()
        return records.map((record) => {
            if ('lastChild' in record) {
                delete record.lastChild
            }
            return record
        })
    }

    /**
     * From Parent:
     *
     * Updates the `lastChild` property of the record associated with the `workoutId` with the
     * most recently created child record. Locked records are not updated.
     */
    async updateLastChild(workoutId: IdType) {
        const lastChild = (
            await this.db
                .table(TableEnum.WORKOUT_RESULTS)
                .where('workoutId')
                .equals(workoutId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await this.db.table(TableEnum.WORKOUTS).update(workoutId, { lastChild })
    }

    /**
     * Toggles the favorited status on the record's status property.
     */
    async toggleFavorite(record: WorkoutType) {
        const index = record.status.indexOf(StatusEnum.FAVORITED)
        if (index === -1) {
            record.status.push(StatusEnum.FAVORITED)
        } else {
            record.status.splice(index, 1)
        }
        await this.db.table(TableEnum.WORKOUTS).update(record.id, { status: record.status })
    }

    /**
     * Generates an options list of records for select box components on the FE.
     */
    async getSelectOptions(): Promise<SelectOption[]> {
        const records = await this.db.table(TableEnum.WORKOUTS).orderBy('name').toArray()

        return records.map((record) => {
            const name = record.name
            const id = truncateText(record.id, 8, '*')
            const favorite = record.status.includes(StatusEnum.FAVORITED) ? '⭐' : ''
            const locked = record.status.includes(StatusEnum.LOCKED) ? '🔒' : ''
            const deactiviated = record.status.includes(StatusEnum.DEACTIVATED) ? '🚫' : ''
            const disable =
                record.status.includes(StatusEnum.LOCKED) ||
                record.status.includes(StatusEnum.DEACTIVATED)

            return {
                value: record.id as IdType,
                label: `${name} (${id}) ${locked}${deactiviated}${favorite}`,
                disable,
            }
        })
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default WorkoutService.getSingleton()
