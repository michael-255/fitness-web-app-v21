import { exerciseResultSchema, type ExerciseResultType } from '@/models/ExerciseResult'
import DB, { Database } from '@/services/db'
import { StatusEnum, TableEnum } from '@/shared/enums'
import { databaseIcon } from '@/shared/icons'
import type { IdType, SelectOption } from '@/shared/types'
import { hiddenTableColumn, tableColumn, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Exercise Result model.
 */
export class ExerciseResultService extends BaseService {
    private static _instance: ExerciseResultService | null = null

    private constructor(public db: Database) {
        super()
    }

    static getSingleton(db: Database = DB): ExerciseResultService {
        if (!ExerciseResultService._instance) {
            ExerciseResultService._instance = new ExerciseResultService(db)
        }
        return ExerciseResultService._instance
    }

    labelSingular = 'Exercise Result'
    labelPlural = 'Exercise Results'
    modelSchema = exerciseResultSchema
    table = TableEnum.EXERCISE_RESULTS
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('exerciseId', 'Parent Exercise Id', 'UUID'),
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
     * Returns live query of records ordered by creation date.
     */
    liveTable(): Observable<ExerciseResultType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<ExerciseResultType[] | Record<string, any>[]> {
        return liveQuery(() =>
            this.db.table(TableEnum.EXERCISE_RESULTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns chart datasets for the records associated with a parent.
     * TODO: Implement for charts.
     */
    async getChartDatasets(exerciseId: IdType) {
        console.log('getChartDatasets', exerciseId)
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
    async get(id: IdType): Promise<ExerciseResultType>
    async get(id: IdType): Promise<Record<string, any>>
    async get(id: IdType): Promise<ExerciseResultType | Record<string, any>> {
        const recordToGet = await this.db.table(TableEnum.EXERCISE_RESULTS).get(id)
        if (!recordToGet) {
            throw new Error(`Exercise Result ID not found: ${id}`)
        }
        return recordToGet
    }

    /**
     * Creates a new record and updates the parent `lastChild` property.
     */
    async add(record: ExerciseResultType): Promise<ExerciseResultType>
    async add(record: ExerciseResultType): Promise<Record<string, any>>
    async add(record: ExerciseResultType): Promise<ExerciseResultType | Record<string, any>> {
        const validatedRecord = exerciseResultSchema.parse(record)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.EXERCISE_RESULTS),
            this.db.table(TableEnum.EXERCISES),
            async () => {
                await this.db.table(TableEnum.EXERCISE_RESULTS).add(validatedRecord)
                await this.updateLastChild(validatedRecord.exerciseId)
            },
        )
        return validatedRecord
    }

    /**
     * Creates or overwrites a child record and updates the parent record's `lastChild` property.
     */
    async put(record: ExerciseResultType): Promise<ExerciseResultType>
    async put(record: ExerciseResultType): Promise<Record<string, any>>
    async put(record: ExerciseResultType): Promise<ExerciseResultType | Record<string, any>> {
        const validatedRecord = exerciseResultSchema.parse(record)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.EXERCISE_RESULTS),
            this.db.table(TableEnum.EXERCISES),
            async () => {
                await this.db.table(TableEnum.EXERCISE_RESULTS).put(validatedRecord)
                await this.updateLastChild(validatedRecord.exerciseId)
            },
        )
        return validatedRecord
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async remove(id: IdType): Promise<ExerciseResultType>
    async remove(id: IdType): Promise<Record<string, any>>
    async remove(id: IdType): Promise<ExerciseResultType | Record<string, any>> {
        const recordToDelete = await this.db.table(TableEnum.EXERCISE_RESULTS).get(id)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.EXERCISE_RESULTS),
            this.db.table(TableEnum.EXERCISES),
            async () => {
                await this.db.table(TableEnum.EXERCISE_RESULTS).delete(id)
                await this.updateLastChild(recordToDelete.exerciseId)
            },
        )
        return recordToDelete
    }

    /**
     * Imports records into the database using put and returns a results object.
     */
    async importData(records: ExerciseResultType[]) {
        const validRecords: ExerciseResultType[] = []
        const invalidRecords: Partial<ExerciseResultType>[] = []

        // Validate each record
        records.forEach((record) => {
            if (exerciseResultSchema.safeParse(record).success) {
                validRecords.push(exerciseResultSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await this.db.table(TableEnum.EXERCISE_RESULTS).bulkAdd(validRecords)
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
     * Updates the `lastChild` property of the parent model associated with the `exerciseId` with the
     * most recently created child model. Locked records are not updated.
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
     * Generates an options list of records for select box components on the FE.
     */
    async getSelectOptions(): Promise<SelectOption[]> {
        const records = await this.db
            .table(TableEnum.EXERCISE_RESULTS)
            .orderBy('createdAt')
            .reverse()
            .toArray()

        return records.map((record) => {
            const id = truncateText(record.id, 8, '*')
            const exerciseId = truncateText(record.exerciseId, 8, '*')
            const locked = record.status.includes(StatusEnum.LOCKED) ? '🔒' : ''
            const disable = record.status.includes(StatusEnum.LOCKED)

            return {
                value: record.id as IdType,
                label: `${id} (${exerciseId}) ${locked}`,
                disable,
            }
        })
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default ExerciseResultService.getSingleton()
