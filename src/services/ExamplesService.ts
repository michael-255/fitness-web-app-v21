import DB, { Database } from '@/services/db'
import { TableEnum, TagEnum } from '@/shared/enums'
import { exampleSchema } from '@/shared/schemas'
import type { ExampleType, IdType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'

export default function ExamplesService(db: Database = DB) {
    /**
     * Returns Examples live query with records that are not enabled filtered out and the remaining
     * sorted alphabetically by name with favorited records given priority.
     */
    function liveDashboardObservable(): Observable<ExampleType[]> {
        return liveQuery(() =>
            db
                .table(TableEnum.EXAMPLES)
                .orderBy('name')
                .filter((record) => record.tags.includes(TagEnum.ENABLED))
                .toArray()
                .then((records) =>
                    records.sort((a, b) => {
                        const aIsFavorited = a.tags.includes(TagEnum.FAVORITED)
                        const bIsFavorited = b.tags.includes(TagEnum.FAVORITED)

                        if (aIsFavorited && !bIsFavorited) {
                            return -1 // a comes first
                        } else if (!aIsFavorited && bIsFavorited) {
                            return 1 // b comes first
                        } else {
                            // If both or neither are favorited, sort alphabetically by name
                            const nameComparison = a.name.localeCompare(b.name)
                            if (nameComparison !== 0) {
                                return nameComparison
                            } else {
                                // If names are identical, sort by createdAt reversed (b - a)
                                return (
                                    new Date(b.createdAt).getTime() -
                                    new Date(a.createdAt).getTime()
                                )
                            }
                        }
                    }),
                ),
        )
    }

    /**
     * Returns Examples live query ordered by creation date.
     */
    function liveObservable(): Observable<ExampleType[]> {
        return liveQuery(() => db.table(TableEnum.EXAMPLES).orderBy('name').reverse().toArray())
    }

    /**
     * Returns Example by ID.
     */
    async function get(id: IdType): Promise<ExampleType> {
        const recordToGet = await db.table(TableEnum.EXAMPLES).get(id)
        if (!recordToGet) {
            throw new Error(`Example ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new Example in the database.
     */
    async function add(example: ExampleType): Promise<ExampleType> {
        const validatedRecord = exampleSchema.parse(example)
        await db.table(TableEnum.EXAMPLES).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a record in the database.
     */
    async function put(example: ExampleType): Promise<ExampleType> {
        const validatedRecord = exampleSchema.parse(example)
        await db.table(TableEnum.EXAMPLES).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the Example by id and all associated child records from the database.
     */
    async function remove(id: IdType): Promise<ExampleType> {
        const recordToDelete = await db.table(TableEnum.EXAMPLES).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLES),
            db.table(TableEnum.EXAMPLE_RESULTS),
            async () => {
                await db.table(TableEnum.EXAMPLES).delete(id)
                await db.table(TableEnum.EXAMPLE_RESULTS).where('parentId').equals(id).delete()
            },
        )
        return recordToDelete
    }

    /**
     * Imports Examples into the database using put and returns a results object.
     */
    async function importData(examples: ExampleType[]) {
        const validRecords: ExampleType[] = []
        const invalidRecords: Partial<ExampleType>[] = []

        // Validate each Example
        examples.forEach((record) => {
            if (exampleSchema.safeParse(record).success) {
                validRecords.push(exampleSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated Examples into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await db.table(TableEnum.EXAMPLES).bulkAdd(validRecords)
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
     * Custom export operation for fetching all Examples from the database with unneeded fields
     * removed.
     */
    async function exportData() {
        const records = await db.table(TableEnum.EXAMPLES).toArray()
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
     * Updates the `lastChild` property of the Example associated with the `parentId` with the
     * most recently created child record.
     */
    async function updateLastChild(parentId: IdType) {
        const lastChild = (
            await db
                .table(TableEnum.EXAMPLE_RESULTS)
                .where('parentId')
                .equals(parentId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.tags.includes(TagEnum.LOCKED))
            .reverse()[0]

        await db.table(TableEnum.EXAMPLES).update(parentId, { lastChild })
    }

    /**
     * Toggles the favorited tag on the Example's tags property.
     */
    async function toggleFavorite(example: ExampleType) {
        const index = example.tags.indexOf(TagEnum.FAVORITED)
        if (index === -1) {
            example.tags.push(TagEnum.FAVORITED)
        } else {
            example.tags.splice(index, 1)
        }
        await db.table(TableEnum.EXAMPLES).update(example.id, { tags: example.tags })
    }

    /**
     * Generates an options list of Examples for select box components on the FE.
     */
    async function getSelectOptions(): Promise<SelectOption[]> {
        const records = await db.table(TableEnum.EXAMPLES).orderBy('name').toArray()
        return records.map((record) => ({
            value: record.id as IdType,
            label: `${record.name} (${truncateText(record.id, 8, '*')})`,
            disable: record.tags.includes(TagEnum.LOCKED) as boolean,
        }))
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
