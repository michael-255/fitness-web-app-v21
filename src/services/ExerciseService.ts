import { exerciseSchema, type ExerciseType } from '@/models/Exercise'
import { StatusEnum, TableEnum } from '@/shared/enums'
import { databaseIcon, exercisesPageIcon } from '@/shared/icons'
import type { IdType, SelectOption } from '@/shared/types'
import { hiddenTableColumn, tableColumn, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Exercise model.
 */
export class ExerciseService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Exercise'
    labelPlural = 'Exercises'
    modelSchema = exerciseSchema
    table = TableEnum.EXERCISES
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('name', 'Name', 'TEXT'),
        tableColumn('desc', 'Description', 'TEXT'),
        tableColumn('status', 'Status', 'LIST-PRINT'),
        tableColumn('lastChild', 'Last Exercise Result', 'JSON'),
        tableColumn('inputs', 'Exercise Inputs'),
        tableColumn('initialSetCount', 'Initial Set Count'),
        tableColumn('restTimer', 'Rest Timer Settings', 'JSON'),
        tableColumn('tabataTimer', 'Tabata Timer Settings', 'JSON'),
    ]
    displayIcon = exercisesPageIcon
    tableIcon = databaseIcon
    supportsTableColumnFilters = true
    supportsTableCharts = false
    supportsCharts = true
    supportsInspect = true
    supportsCreate = true
    supportsEdit = true
    supportsDelete = true

    /**
     * Returns live query with records that are not deactivated with the remaining sorted with
     * locked records first, then favorited records, then alphabetically by name, and finally by
     * createdAt reversed.
     */
    liveDashboard(): Observable<ExerciseType[]>
    liveDashboard(): Observable<Record<string, any>[]>
    liveDashboard(): Observable<ExerciseType[] | Record<string, any>[]> {
        return liveQuery(() =>
            this.db
                .table(TableEnum.EXERCISES)
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
     * Returns live query or records ordered by name.
     */
    liveTable(): Observable<ExerciseType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<ExerciseType[] | Record<string, any>[]> {
        return liveQuery(() => this.db.table(TableEnum.EXERCISES).orderBy('name').toArray())
    }

    /**
     * Returns record by ID.
     */
    async get(id: IdType): Promise<ExerciseType>
    async get(id: IdType): Promise<Record<string, any>>
    async get(id: IdType): Promise<ExerciseType | Record<string, any>> {
        const recordToGet = await this.db.table(TableEnum.EXERCISES).get(id)
        if (!recordToGet) {
            throw new Error(`Exercise ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new Exercise in the database.
     */
    async add(record: ExerciseType): Promise<ExerciseType>
    async add(record: ExerciseType): Promise<Record<string, any>>
    async add(record: ExerciseType): Promise<ExerciseType | Record<string, any>> {
        const validatedRecord = exerciseSchema.parse(record)
        await this.db.table(TableEnum.EXERCISES).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a record in the database.
     */
    async put(record: ExerciseType): Promise<ExerciseType>
    async put(record: ExerciseType): Promise<Record<string, any>>
    async put(record: ExerciseType): Promise<ExerciseType | Record<string, any>> {
        const validatedRecord = exerciseSchema.parse(record)
        await this.db.table(TableEnum.EXERCISES).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the record by id and all associated child records from the database.
     */
    async remove(id: IdType): Promise<ExerciseType>
    async remove(id: IdType): Promise<Record<string, any>>
    async remove(id: IdType): Promise<ExerciseType | Record<string, any>> {
        const recordToDelete = await this.db.table(TableEnum.EXERCISES).get(id)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.EXERCISES),
            this.db.table(TableEnum.EXERCISE_RESULTS),
            async () => {
                await this.db.table(TableEnum.EXERCISES).delete(id)
                await this.db
                    .table(TableEnum.EXERCISE_RESULTS)
                    .where('exerciseId')
                    .equals(id)
                    .delete()
            },
        )
        return recordToDelete
    }

    /**
     * Imports records into the database using put and returns a results object.
     */
    async importData(records: ExerciseType[]) {
        const validRecords: ExerciseType[] = []
        const invalidRecords: Partial<ExerciseType>[] = []

        // Validate each record
        records.forEach((exercise) => {
            if (exerciseSchema.safeParse(exercise).success) {
                validRecords.push(exerciseSchema.parse(exercise)) // Clean record with parse
            } else {
                invalidRecords.push(exercise)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await this.db.table(TableEnum.EXERCISES).bulkAdd(validRecords)
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
        const records = await this.db.table(TableEnum.EXERCISES).toArray()
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
     * Updates the `lastChild` property of the record associated with the `exerciseId` with the
     * most recently created child record. Locked records are not updated.
     */
    async updateLastChild(exerciseId: IdType) {
        const lastChild = (
            await this.db
                .table(TableEnum.EXERCISE_RESULTS)
                .where('exerciseId')
                .equals(exerciseId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await this.db.table(TableEnum.EXERCISES).update(exerciseId, { lastChild })
    }

    /**
     * Toggles the favorited status on the record's status property.
     */
    async toggleFavorite(record: ExerciseType) {
        const index = record.status.indexOf(StatusEnum.FAVORITED)
        if (index === -1) {
            record.status.push(StatusEnum.FAVORITED)
        } else {
            record.status.splice(index, 1)
        }
        await this.db.table(TableEnum.EXERCISES).update(record.id, { status: record.status })
    }

    /**
     * Generates an options list of records for select box components on the FE.
     */
    async getSelectOptions(): Promise<SelectOption[]> {
        const records = await this.db.table(TableEnum.EXERCISES).orderBy('name').toArray()

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
export default ExerciseService.instance()
