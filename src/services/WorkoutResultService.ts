import { workoutResultSchema, type WorkoutResultType } from '@/models/WorkoutResult'
import DB, { Database } from '@/services/db'
import { StatusEnum, TableEnum } from '@/shared/enums'
import type { IdType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'

export default function WorkoutResultService(db: Database = DB) {
    /**
     * Returns Workout Results live query ordered by creation date with locked records filtered out.
     */
    function liveObservable(): Observable<WorkoutResultType[]> {
        return liveQuery(() =>
            db
                .table(TableEnum.WORKOUT_RESULTS)
                .orderBy('createdAt')
                .reverse()
                .filter((record) => !record.status.includes(StatusEnum.LOCKED))
                .toArray(),
        )
    }

    /**
     * Returns chart datasets for the Workout Results associated with a parent Workout.
     */
    async function getChartDatasets(workoutId: IdType) {
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
     * Returns Workout Result by ID.
     */
    async function get(id: IdType): Promise<WorkoutResultType> {
        const recordToGet = await db.table(TableEnum.WORKOUT_RESULTS).get(id)
        if (!recordToGet) {
            throw new Error(`Workout Result ID not found: ${id}`)
        }
        return recordToGet
    }

    /**
     * Creates a new Workout Result and updates the parent Workout `lastChild` property.
     */
    async function add(workoutResult: WorkoutResultType): Promise<WorkoutResultType> {
        const validatedRecord = workoutResultSchema.parse(workoutResult)
        await db.transaction(
            'rw',
            db.table(TableEnum.WORKOUT_RESULTS),
            db.table(TableEnum.WORKOUTS),
            async () => {
                await db.table(TableEnum.WORKOUT_RESULTS).add(validatedRecord)
                await updateLastChild(validatedRecord.workoutId)
            },
        )
        return validatedRecord
    }

    /**
     * Creates or overwrites a child record and updates the parent record's `lastChild` property.
     */
    async function put(workoutResult: WorkoutResultType): Promise<WorkoutResultType> {
        const validatedRecord = workoutResultSchema.parse(workoutResult)
        await db.transaction(
            'rw',
            db.table(TableEnum.WORKOUT_RESULTS),
            db.table(TableEnum.WORKOUTS),
            async () => {
                await db.table(TableEnum.WORKOUT_RESULTS).put(validatedRecord)
                await updateLastChild(validatedRecord.workoutId)
            },
        )
        return validatedRecord
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async function remove(id: IdType): Promise<WorkoutResultType> {
        const recordToDelete = await db.table(TableEnum.WORKOUT_RESULTS).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.WORKOUT_RESULTS),
            db.table(TableEnum.WORKOUTS),
            async () => {
                await db.table(TableEnum.WORKOUT_RESULTS).delete(id)
                await updateLastChild(recordToDelete.workoutId)
            },
        )
        return recordToDelete
    }

    /**
     * Imports Workout Results into the database using put and returns a results object.
     */
    async function importData(workoutResults: WorkoutResultType[]) {
        const validRecords: WorkoutResultType[] = []
        const invalidRecords: Partial<WorkoutResultType>[] = []

        // Validate each record
        workoutResults.forEach((record) => {
            if (workoutResultSchema.safeParse(record).success) {
                validRecords.push(workoutResultSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await db.table(TableEnum.WORKOUT_RESULTS).bulkAdd(validRecords)
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
     * most recently created child model.
     */
    async function updateLastChild(workoutId: IdType) {
        const lastChild = (
            await db
                .table(TableEnum.WORKOUT_RESULTS)
                .where('workoutId')
                .equals(workoutId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await db.table(TableEnum.WORKOUTS).update(workoutId, { lastChild })
    }

    /**
     * Generates an options list of Workout Results for select box components on the FE. Filters out
     * locked records and truncates the ID to save space.
     */
    async function getSelectOptions(): Promise<SelectOption[]> {
        const records = await db
            .table(TableEnum.WORKOUT_RESULTS)
            .orderBy('createdAt')
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()
            .toArray()

        return records.map((record) => {
            const recordId = truncateText(record.id, 8, '*')
            const recordWorkoutId = truncateText(record.workoutId, 8, '*')

            return {
                value: record.id as IdType,
                label: `${recordId} (${recordWorkoutId})`,
                disable: false, // Already filtered out disabled records
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
