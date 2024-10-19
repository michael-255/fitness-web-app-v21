import { workoutResultSchema, type WorkoutResultType } from '@/models/WorkoutResult'
import DB, { Database } from '@/services/db'
import { StatusEnum, TableEnum } from '@/shared/enums'
import { databaseIcon } from '@/shared/icons'
import type { IdType, SelectOption } from '@/shared/types'
import { hiddenTableColumn, tableColumn, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Workout Result model.
 */
export class WorkoutResultService extends BaseService {
    private static _instance: WorkoutResultService | null = null

    private constructor(public db: Database) {
        super()
    }

    static getSingleton(db: Database = DB): WorkoutResultService {
        if (!WorkoutResultService._instance) {
            WorkoutResultService._instance = new WorkoutResultService(db)
        }
        return WorkoutResultService._instance
    }

    labelSingular = 'Workout Result'
    labelPlural = 'Workout Results'
    modelSchema = workoutResultSchema
    table = TableEnum.WORKOUT_RESULTS
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('workoutId', 'Parent Workout Id', 'UUID'),
        tableColumn('note', 'Note', 'TEXT'),
        tableColumn('status', 'Status', 'LIST-PRINT'),
    ]
    displayIcon = databaseIcon
    tableIcon = databaseIcon
    supportsTableColumnFilters = true
    supportsTableCharts = false
    supportsCharts = false
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
     * Returns live query or records ordered by creation date.
     */
    liveTable(): Observable<WorkoutResultType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<WorkoutResultType[] | Record<string, any>[]> {
        return liveQuery(() =>
            this.db.table(TableEnum.WORKOUT_RESULTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns chart datasets for the record associated with a parent.
     * TODO: Implement for charts.
     */
    async getChartDatasets(workoutId: IdType) {
        console.log('getChartDatasets', workoutId)
        return {
            threeMonths: [],
            oneYear: [],
            allTime: [],
            hasRecords: false,
            hasRecordsBeyondThreeMonths: false,
            hasRecordsBeyondOneYear: false,
        }
    }

    /**
     * Returns record by ID.
     */
    async get(id: IdType): Promise<WorkoutResultType>
    async get(id: IdType): Promise<Record<string, any>>
    async get(id: IdType): Promise<WorkoutResultType | Record<string, any>> {
        const recordToGet = await this.db.table(TableEnum.WORKOUT_RESULTS).get(id)
        if (!recordToGet) {
            throw new Error(`Workout Result ID not found: ${id}`)
        }
        return recordToGet
    }

    /**
     * Creates a new record and updates the parent `lastChild` property.
     */
    async add(record: WorkoutResultType): Promise<WorkoutResultType>
    async add(record: WorkoutResultType): Promise<Record<string, any>>
    async add(record: WorkoutResultType): Promise<WorkoutResultType | Record<string, any>> {
        const validatedRecord = workoutResultSchema.parse(record)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.WORKOUT_RESULTS),
            this.db.table(TableEnum.WORKOUTS),
            async () => {
                await this.db.table(TableEnum.WORKOUT_RESULTS).add(validatedRecord)
                await this.updateLastChild(validatedRecord.workoutId)
            },
        )
        return validatedRecord
    }

    /**
     * Creates or overwrites a child record and updates the parent record's `lastChild` property.
     */
    async put(record: WorkoutResultType): Promise<WorkoutResultType>
    async put(record: WorkoutResultType): Promise<Record<string, any>>
    async put(record: WorkoutResultType): Promise<WorkoutResultType | Record<string, any>> {
        const validatedRecord = workoutResultSchema.parse(record)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.WORKOUT_RESULTS),
            this.db.table(TableEnum.WORKOUTS),
            async () => {
                await this.db.table(TableEnum.WORKOUT_RESULTS).put(validatedRecord)
                await this.updateLastChild(validatedRecord.workoutId)
            },
        )
        return validatedRecord
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async remove(id: IdType): Promise<WorkoutResultType>
    async remove(id: IdType): Promise<Record<string, any>>
    async remove(id: IdType): Promise<WorkoutResultType | Record<string, any>> {
        const recordToDelete = await this.db.table(TableEnum.WORKOUT_RESULTS).get(id)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.WORKOUT_RESULTS),
            this.db.table(TableEnum.WORKOUTS),
            async () => {
                await this.db.table(TableEnum.WORKOUT_RESULTS).delete(id)
                await this.updateLastChild(recordToDelete.workoutId)
            },
        )
        return recordToDelete
    }

    /**
     * Imports records into the database using put and returns a results object.
     */
    async importData(records: WorkoutResultType[]) {
        const validRecords: WorkoutResultType[] = []
        const invalidRecords: Partial<WorkoutResultType>[] = []

        // Validate each record
        records.forEach((record) => {
            if (workoutResultSchema.safeParse(record).success) {
                validRecords.push(workoutResultSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await this.db.table(TableEnum.WORKOUT_RESULTS).bulkAdd(validRecords)
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
     * From Child:
     *
     * Updates the `lastChild` property of the parent model associated with the `workoutId` with the
     * most recently created child model. Locked records are not updated.
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
     * Generates an options list of records for select box components on the FE.
     */
    async getSelectOptions(): Promise<SelectOption[]> {
        const records = await this.db
            .table(TableEnum.WORKOUT_RESULTS)
            .orderBy('createdAt')
            .reverse()
            .toArray()

        return records.map((record) => {
            const id = truncateText(record.id, 8, '*')
            const workoutId = truncateText(record.workoutId, 8, '*')
            const locked = record.status.includes(StatusEnum.LOCKED) ? '🔒' : ''
            const disable = record.status.includes(StatusEnum.LOCKED)

            return {
                value: record.id as IdType,
                label: `${id} (${workoutId}) ${locked}`,
                disable,
            }
        })
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default WorkoutResultService.getSingleton()
