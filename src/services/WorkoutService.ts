import { workoutSchema, type WorkoutType } from '@/models/Workout'
import DB, { Database } from '@/services/db'
import { StatusEnum, TableEnum } from '@/shared/enums'
import type { IdType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'

export default function WorkoutService(db: Database = DB) {
    /**
     * Returns Workouts live query with records that are not deactivated with the remaining sorted
     * with locked records first, then favorited records, then alphabetically by name, and finally
     * by createdAt reversed.
     */
    function liveDashboardObservable(): Observable<WorkoutType[]> {
        return liveQuery(() =>
            db
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
     * Returns Workouts live query ordered by name with locked records filtered out.
     */
    function liveObservable(): Observable<WorkoutType[]> {
        return liveQuery(() =>
            db
                .table(TableEnum.WORKOUTS)
                .orderBy('name')
                .filter((record) => !record.status.includes(StatusEnum.LOCKED))
                .toArray(),
        )
    }

    /**
     * Returns Workout by ID.
     */
    async function get(id: IdType): Promise<WorkoutType> {
        const recordToGet = await db.table(TableEnum.WORKOUTS).get(id)
        if (!recordToGet) {
            throw new Error(`Workout ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new Workout in the database.
     */
    async function add(workout: WorkoutType): Promise<WorkoutType> {
        const validatedRecord = workoutSchema.parse(workout)
        await db.table(TableEnum.WORKOUTS).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a Workout in the database.
     */
    async function put(workout: WorkoutType): Promise<WorkoutType> {
        const validatedRecord = workoutSchema.parse(workout)
        await db.table(TableEnum.WORKOUTS).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the Workout by id and all associated child records from the database.
     */
    async function remove(id: IdType): Promise<WorkoutType> {
        const recordToDelete = await db.table(TableEnum.WORKOUTS).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.WORKOUTS),
            db.table(TableEnum.WORKOUT_RESULTS),
            async () => {
                await db.table(TableEnum.WORKOUTS).delete(id)
                await db.table(TableEnum.WORKOUT_RESULTS).where('workoutId').equals(id).delete()
            },
        )
        return recordToDelete
    }

    /**
     * Imports Workouts into the database using put and returns a results object.
     */
    async function importData(workouts: WorkoutType[]) {
        const validRecords: WorkoutType[] = []
        const invalidRecords: Partial<WorkoutType>[] = []

        // Validate each record
        workouts.forEach((workout) => {
            if (workoutSchema.safeParse(workout).success) {
                validRecords.push(workoutSchema.parse(workout)) // Clean record with parse
            } else {
                invalidRecords.push(workout)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await db.table(TableEnum.WORKOUTS).bulkAdd(validRecords)
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
     * Custom export operation for fetching all Workouts from the database with unneeded fields
     * removed.
     */
    async function exportData() {
        const records = await db.table(TableEnum.WORKOUTS).toArray()
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
     * Updates the `lastChild` property of the Workout associated with the `workoutId` with the
     * most recently created child record.
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
     * Toggles the favorited status on the Workout's status property.
     */
    async function toggleFavorite(workout: WorkoutType) {
        const index = workout.status.indexOf(StatusEnum.FAVORITED)
        if (index === -1) {
            workout.status.push(StatusEnum.FAVORITED)
        } else {
            workout.status.splice(index, 1)
        }
        await db.table(TableEnum.WORKOUTS).update(workout.id, { status: workout.status })
    }

    /**
     * Generates an options list of Workouts for select box components on the FE. Filters out
     * locked and deactivated records and truncates the ID to save space.
     */
    async function getSelectOptions(): Promise<SelectOption[]> {
        const records = await db
            .table(TableEnum.WORKOUTS)
            .orderBy('name')
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .filter((record) => !record.status.includes(StatusEnum.DEACTIVATED))
            .toArray()

        return records.map((record) => {
            const recordName = record.name
            const recordId = truncateText(record.id, 8, '*')
            const recordFavorite = record.status.includes(StatusEnum.FAVORITED) ? '⭐' : ''

            return {
                value: record.id as IdType,
                label: `${recordName} (${recordId}) ${recordFavorite}`,
                disable: false, // Already filtered out disabled records
            }
        })
    }

    return {
        liveDashboardObservable,
        liveObservable,
        get,
        add,
        put,
        remove,
        importData,
        exportData,
        updateLastChild,
        toggleFavorite,
        getSelectOptions,
    }
}
