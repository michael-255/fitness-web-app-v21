import { measurementSchema, type MeasurementType } from '@/models/Measurements'
import DB, { Database } from '@/services/db'
import { TableEnum } from '@/shared/enums'
import type { IdType } from '@/shared/types'
import { liveQuery, type Observable } from 'dexie'

export default function MeasurementService(db: Database = DB) {
    /**
     * Returns Measurements live query ordered by creation date.
     */
    function liveObservable(): Observable<MeasurementType[]> {
        return liveQuery(() =>
            db.table(TableEnum.MEASUREMENTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Charting functions for each Measurement type.
     * TODO: Implement for charts.
     */

    /**
     * Returns Measurement by ID.
     */
    async function get(id: IdType): Promise<MeasurementType> {
        const recordToGet = await db.table(TableEnum.MEASUREMENTS).get(id)
        if (!recordToGet) {
            throw new Error(`Measurement ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new Measurement in the database.
     */
    async function add(exercise: MeasurementType): Promise<MeasurementType> {
        const validatedRecord = measurementSchema.parse(exercise)
        await db.table(TableEnum.MEASUREMENTS).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a Measurement in the database.
     */
    async function put(exercise: MeasurementType): Promise<MeasurementType> {
        const validatedRecord = measurementSchema.parse(exercise)
        await db.table(TableEnum.MEASUREMENTS).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the Measurement by ID.
     */
    async function remove(id: IdType): Promise<MeasurementType> {
        const recordToDelete = await db.table(TableEnum.MEASUREMENTS).get(id)
        await db.table(TableEnum.MEASUREMENTS).delete(id)
        return recordToDelete
    }

    /**
     * Imports Measurements into the database using put and returns a results object.
     */
    async function importData(measurements: MeasurementType[]) {
        const validRecords: MeasurementType[] = []
        const invalidRecords: Partial<MeasurementType>[] = []

        // Validate each record
        measurements.forEach((measurement) => {
            if (measurementSchema.safeParse(measurement).success) {
                validRecords.push(measurementSchema.parse(measurement)) // Clean record with parse
            } else {
                invalidRecords.push(measurement)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await db.table(TableEnum.MEASUREMENTS).bulkAdd(validRecords)
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

    return {
        liveObservable,
        get,
        add,
        put,
        remove,
        importData,
    }
}
