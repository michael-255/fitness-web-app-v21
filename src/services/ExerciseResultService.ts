import { exerciseResultSchema, type ExerciseResultType } from '@/models/ExerciseResult'
import DB, { Database } from '@/services/db'
import { StatusEnum, TableEnum } from '@/shared/enums'
import type { IdType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'

export default function ExerciseResultService(db: Database = DB) {
    /**
     * Returns Exercise Results live query ordered by creation date.
     */
    function liveObservable(): Observable<ExerciseResultType[]> {
        return liveQuery(() =>
            db.table(TableEnum.EXERCISE_RESULTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns chart datasets for the Exercise Results associated with a parent Exercise.
     * TODO: Implement for charts.
     */
    async function getChartDatasets(exerciseId: IdType) {
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
     * Returns Exercise Result by ID.
     */
    async function get(id: IdType): Promise<ExerciseResultType> {
        const recordToGet = await db.table(TableEnum.EXERCISE_RESULTS).get(id)
        if (!recordToGet) {
            throw new Error(`Exercise Result ID not found: ${id}`)
        }
        return recordToGet
    }

    /**
     * Creates a new Exercise Result and updates the parent Exercise `lastChild` property.
     */
    async function add(exerciseResult: ExerciseResultType): Promise<ExerciseResultType> {
        const validatedRecord = exerciseResultSchema.parse(exerciseResult)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXERCISE_RESULTS),
            db.table(TableEnum.EXERCISES),
            async () => {
                await db.table(TableEnum.EXERCISE_RESULTS).add(validatedRecord)
                await updateLastChild(validatedRecord.exerciseId)
            },
        )
        return validatedRecord
    }

    /**
     * Creates or overwrites a child record and updates the parent record's `lastChild` property.
     */
    async function put(exerciseResult: ExerciseResultType): Promise<ExerciseResultType> {
        const validatedRecord = exerciseResultSchema.parse(exerciseResult)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXERCISE_RESULTS),
            db.table(TableEnum.EXERCISES),
            async () => {
                await db.table(TableEnum.EXERCISE_RESULTS).put(validatedRecord)
                await updateLastChild(validatedRecord.exerciseId)
            },
        )
        return validatedRecord
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async function remove(id: IdType): Promise<ExerciseResultType> {
        const recordToDelete = await db.table(TableEnum.EXERCISE_RESULTS).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXERCISE_RESULTS),
            db.table(TableEnum.EXERCISES),
            async () => {
                await db.table(TableEnum.EXERCISE_RESULTS).delete(id)
                await updateLastChild(recordToDelete.exerciseId)
            },
        )
        return recordToDelete
    }

    /**
     * Imports Exercise Results into the database using put and returns a results object.
     */
    async function importData(exerciseResults: ExerciseResultType[]) {
        const validRecords: ExerciseResultType[] = []
        const invalidRecords: Partial<ExerciseResultType>[] = []

        // Validate each record
        exerciseResults.forEach((record) => {
            if (exerciseResultSchema.safeParse(record).success) {
                validRecords.push(exerciseResultSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await db.table(TableEnum.EXERCISE_RESULTS).bulkAdd(validRecords)
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
    async function updateLastChild(exerciseId: IdType) {
        const lastChild = (
            await db
                .table(TableEnum.EXERCISE_RESULTS)
                .where('exerciseId')
                .equals(exerciseId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await db.table(TableEnum.EXERCISES).update(exerciseId, { lastChild })
    }

    /**
     * Generates an options list of Exercise Results for select box components on the FE.
     */
    async function getSelectOptions(): Promise<SelectOption[]> {
        const records = await db
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

    return {
        liveObservable,
        getChartDatasets,
        get,
        add,
        put,
        remove,
        importData,
        updateLastChild,
        getSelectOptions,
    }
}
