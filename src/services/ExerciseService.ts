import { exerciseSchema, type ExerciseType } from '@/models/Exercise'
import DB, { Database } from '@/services/db'
import { StatusEnum, TableEnum } from '@/shared/enums'
import type { IdType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'

export default function ExerciseService(db: Database = DB) {
    /**
     * Returns Exercises live query with records that are not deactivated with the remaining sorted
     * with locked records first, then favorited records, then alphabetically by name, and finally
     * by createdAt reversed.
     */
    function liveDashboardObservable(): Observable<ExerciseType[]> {
        return liveQuery(() =>
            db
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
     * Returns Exercises live query ordered by name.
     */
    function liveObservable(): Observable<ExerciseType[]> {
        return liveQuery(() => db.table(TableEnum.EXERCISES).orderBy('name').toArray())
    }

    /**
     * Returns Exercise by ID.
     */
    async function get(id: IdType): Promise<ExerciseType> {
        const recordToGet = await db.table(TableEnum.EXERCISES).get(id)
        if (!recordToGet) {
            throw new Error(`Exercise ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new Exercise in the database.
     */
    async function add(exercise: ExerciseType): Promise<ExerciseType> {
        const validatedRecord = exerciseSchema.parse(exercise)
        await db.table(TableEnum.EXERCISES).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a Exercise in the database.
     */
    async function put(exercise: ExerciseType): Promise<ExerciseType> {
        const validatedRecord = exerciseSchema.parse(exercise)
        await db.table(TableEnum.EXERCISES).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the Exercise by id and all associated child records from the database.
     */
    async function remove(id: IdType): Promise<ExerciseType> {
        const recordToDelete = await db.table(TableEnum.EXERCISES).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXERCISES),
            db.table(TableEnum.EXERCISE_RESULTS),
            async () => {
                await db.table(TableEnum.EXERCISES).delete(id)
                await db.table(TableEnum.EXERCISE_RESULTS).where('exerciseId').equals(id).delete()
            },
        )
        return recordToDelete
    }

    /**
     * Imports Exercises into the database using put and returns a results object.
     */
    async function importData(exercises: ExerciseType[]) {
        const validRecords: ExerciseType[] = []
        const invalidRecords: Partial<ExerciseType>[] = []

        // Validate each record
        exercises.forEach((exercise) => {
            if (exerciseSchema.safeParse(exercise).success) {
                validRecords.push(exerciseSchema.parse(exercise)) // Clean record with parse
            } else {
                invalidRecords.push(exercise)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await db.table(TableEnum.EXERCISES).bulkAdd(validRecords)
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
     * Custom export operation for fetching all Exercises from the database with unneeded fields
     * removed.
     */
    async function exportData() {
        const records = await db.table(TableEnum.EXERCISES).toArray()
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
     * Updates the `lastChild` property of the Exercise associated with the `exerciseId` with the
     * most recently created child record. Locked records are not updated.
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
     * Toggles the favorited status on the Exercise's status property.
     */
    async function toggleFavorite(exercise: ExerciseType) {
        const index = exercise.status.indexOf(StatusEnum.FAVORITED)
        if (index === -1) {
            exercise.status.push(StatusEnum.FAVORITED)
        } else {
            exercise.status.splice(index, 1)
        }
        await db.table(TableEnum.EXERCISES).update(exercise.id, { status: exercise.status })
    }

    /**
     * Generates an options list of Exercises for select box components on the FE.
     */
    async function getSelectOptions(): Promise<SelectOption[]> {
        const records = await db.table(TableEnum.EXERCISES).orderBy('name').toArray()

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
