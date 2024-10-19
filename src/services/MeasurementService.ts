import { measurementSchema, type MeasurementType } from '@/models/Measurements'
import DB, { Database } from '@/services/db'
import { TableEnum } from '@/shared/enums'
import { databaseIcon, measurementsPageIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Measurement model.
 */
export class MeasurementService extends BaseService {
    private static _instance: MeasurementService | null = null

    private constructor(public db: Database) {
        super()
    }

    static getSingleton(db: Database = DB): MeasurementService {
        if (!MeasurementService._instance) {
            MeasurementService._instance = new MeasurementService(db)
        }
        return MeasurementService._instance
    }

    labelSingular = 'Measurement'
    labelPlural = 'Measurements'
    modelSchema = measurementSchema
    table = TableEnum.MEASUREMENTS
    tableColumns = [] // TODO
    displayIcon = measurementsPageIcon
    tableIcon = databaseIcon
    supportsTableColumnFilters = false // TODO
    supportsTableCharts = false // TODO
    supportsCharts = false // TODO
    supportsInspect = false // TODO
    supportsCreate = false // TODO
    supportsEdit = false // TODO
    supportsDelete = false // TODO
    chartsDialogProps = null! // TODO
    inspectDialogProps = null! // TODO
    createDialogProps = null! // TODO
    editDialogProps = null! // TODO
    deleteDialogProps = null! // TODO

    /**
     * Returns live query ordered by creation date.
     */
    liveObservable(): Observable<MeasurementType[]> {
        return liveQuery(() =>
            this.db.table(TableEnum.MEASUREMENTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns record by ID.
     */
    async get(id: IdType): Promise<MeasurementType> {
        const recordToGet = await this.db.table(TableEnum.MEASUREMENTS).get(id)
        if (!recordToGet) {
            throw new Error(`Measurement ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new record in the database.
     */
    async add(exercise: MeasurementType): Promise<MeasurementType> {
        const validatedRecord = measurementSchema.parse(exercise)
        await this.db.table(TableEnum.MEASUREMENTS).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a record in the database.
     */
    async put(record: MeasurementType): Promise<MeasurementType> {
        const validatedRecord = measurementSchema.parse(record)
        await this.db.table(TableEnum.MEASUREMENTS).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the Measurement by ID.
     */
    async remove(id: IdType): Promise<MeasurementType> {
        const recordToDelete = await this.db.table(TableEnum.MEASUREMENTS).get(id)
        await this.db.table(TableEnum.MEASUREMENTS).delete(id)
        return recordToDelete
    }

    /**
     * Imports records into the database using put and returns a results object.
     */
    async importData(records: MeasurementType[]) {
        const validRecords: MeasurementType[] = []
        const invalidRecords: Partial<MeasurementType>[] = []

        // Validate each record
        records.forEach((record) => {
            if (measurementSchema.safeParse(record).success) {
                validRecords.push(measurementSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await this.db.table(TableEnum.MEASUREMENTS).bulkAdd(validRecords)
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
}

/**
 * Singleton instance exported as default for convenience.
 */
export default MeasurementService.getSingleton()
