import DialogChartActivityWorkouts from '@/components/dialogs/chart/DialogChartActivityWorkouts.vue'
import DialogChartWorkout from '@/components/dialogs/chart/DialogChartWorkout.vue'
import DialogCreate from '@/components/dialogs/DialogCreate.vue'
import DialogDelete from '@/components/dialogs/DialogDelete.vue'
import DialogEdit from '@/components/dialogs/DialogEdit.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import DialogToggleFavorite from '@/components/dialogs/DialogToggleFavorite.vue'
import FormItemCreatedDate from '@/components/dialogs/forms/FormItemCreatedDate.vue'
import FormItemDescription from '@/components/dialogs/forms/FormItemDescription.vue'
import FormItemId from '@/components/dialogs/forms/FormItemId.vue'
import FormItemName from '@/components/dialogs/forms/FormItemName.vue'
import FormItemStatus from '@/components/dialogs/forms/FormItemStatus.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemList from '@/components/dialogs/inspect/InspectItemList.vue'
import InspectItemObject from '@/components/dialogs/inspect/InspectItemObject.vue'
import InspectItemString from '@/components/dialogs/inspect/InspectItemString.vue'
import Workout, { workoutSchema, type WorkoutType } from '@/models/Workout'
import { StatusEnum, TableEnum } from '@/shared/enums'
import { databaseIcon, workoutsPageIcon } from '@/shared/icons'
import type { IdType, SelectOption } from '@/shared/types'
import { hiddenTableColumn, tableColumn, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import type { QDialogOptions } from 'quasar'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Workout model.
 */
export class WorkoutService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Workout'
    labelPlural = 'Workouts'
    modelSchema = workoutSchema
    table = TableEnum.WORKOUTS
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('name', 'Name', 'TEXT'),
        tableColumn('desc', 'Description', 'TEXT'),
        tableColumn('status', 'Status', 'LIST-PRINT'),
        tableColumn('lastChild', 'Last Workout Result', 'JSON'),
        tableColumn('warmupGroups', 'Warmup Exercises', 'JSON'),
        tableColumn('exerciseGroups', 'Main Exercises', 'JSON'),
        tableColumn('cooldownGroups', 'Cooldown Exercises', 'JSON'),
        tableColumn('nextWorkoutIds', 'Next records', 'LIST-PRINT'),
    ]
    displayIcon = workoutsPageIcon
    tableIcon = databaseIcon
    supportsTableColumnFilters = true
    supportsActivityCharts = true
    supportsCharts = true
    supportsInspect = true
    supportsCreate = true
    supportsEdit = true
    supportsDelete = true

    /**
     * Returns QDialogOptions options for the chart dialog.
     * @example $q.dialog(service.activityChartsDialogOptions(id))
     */
    activityChartsDialogOptions(): QDialogOptions {
        return { component: DialogChartActivityWorkouts }
    }

    /**
     * Returns QDialogOptions options for the chart dialog.
     * @example $q.dialog(service.chartsDialogOptions(id))
     */
    chartsDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogChartWorkout,
            componentProps: {
                id,
                service: this,
            },
        }
    }

    /**
     * Returns QDialogOptions options for the inspect dialog.
     * @example $q.dialog(service.inspectDialogOptions(id))
     */
    inspectDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogInspect,
            componentProps: {
                id,
                service: this,
                inspectComponents: [
                    { component: InspectItemString, props: { label: 'Id', recordKey: 'id' } },
                    {
                        component: InspectItemDate,
                        props: { label: 'Created Date', recordKey: 'createdAt' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Name', recordKey: 'name' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Description', recordKey: 'desc' },
                    },
                    {
                        component: InspectItemList,
                        props: { label: 'Status', recordKey: 'status' },
                    },
                    {
                        component: InspectItemObject,
                        props: { label: 'Last Workout Result', recordKey: 'lastChild' },
                    },
                    // TODO
                ],
            },
        }
    }

    /**
     * Returns QDialogOptions options for the create dialog.
     * @example $q.dialog(service.createDialogOptions())
     */
    createDialogOptions(): QDialogOptions {
        return {
            component: DialogCreate,
            componentProps: {
                service: this,
                initialRecord: new Workout({}),
                formComponents: [
                    { component: FormItemId },
                    { component: FormItemCreatedDate },
                    { component: FormItemName },
                    { component: FormItemDescription },
                    { component: FormItemStatus },
                    // TODO
                ],
            },
        }
    }

    /**
     * Returns QDialogOptions options for the edit dialog.
     * @example $q.dialog(service.editDialogOptions(id))
     */
    editDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogEdit,
            componentProps: {
                id,
                service: this,
                formComponents: [
                    { component: FormItemId },
                    { component: FormItemCreatedDate },
                    { component: FormItemName },
                    { component: FormItemDescription },
                    { component: FormItemStatus },
                    // TODO
                ],
            },
        }
    }

    /**
     * Returns QDialogOptions options for the delete dialog.
     * @example $q.dialog(service.deleteDialogOptions(id))
     */
    deleteDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogDelete,
            componentProps: {
                id,
                service: this,
                useUnlock: 'ADVANCED-MODE-CONTROLLED',
            },
        }
    }

    /**
     * Returns QDialogOptions for the toggle favorite dialog.
     * @example $q.dialog(service.toggleFavoriteDialogOptions(id))
     */
    toggleFavoriteDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogToggleFavorite,
            componentProps: {
                id,
                service: this,
            },
        }
    }

    /**
     * Returns live query with records that are not hidden with the remaining sorted with
     * locked records first, then favorited records, then alphabetically by name, and finally
     * by createdAt reversed.
     */
    liveDashboard(): Observable<WorkoutType[]>
    liveDashboard(): Observable<Record<string, any>[]>
    liveDashboard(): Observable<WorkoutType[] | Record<string, any>[]> {
        return liveQuery(() =>
            this.db
                .table(TableEnum.WORKOUTS)
                .orderBy('name')
                .filter((record) => !record.status.includes(StatusEnum.HIDDEN))
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
     * Returns records live query ordered by name.
     */
    liveTable(): Observable<WorkoutType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<WorkoutType[] | Record<string, any>> {
        return liveQuery(() => this.db.table(TableEnum.WORKOUTS).orderBy('name').toArray())
    }

    /**
     * Returns record by ID.
     */
    async get(id: IdType): Promise<WorkoutType>
    async get(id: IdType): Promise<Record<string, any>>
    async get(id: IdType): Promise<WorkoutType | Record<string, any>> {
        const recordToGet = await this.db.table(TableEnum.WORKOUTS).get(id)
        if (!recordToGet) {
            throw new Error(`${this.labelSingular} ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new record in the database.
     */
    async add(record: WorkoutType): Promise<WorkoutType>
    async add(record: WorkoutType): Promise<Record<string, any>>
    async add(record: WorkoutType): Promise<WorkoutType | Record<string, any>> {
        const validatedRecord = this.modelSchema.parse(record)
        await this.db.table(TableEnum.WORKOUTS).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a record in the database.
     */
    async put(record: WorkoutType): Promise<WorkoutType>
    async put(record: WorkoutType): Promise<Record<string, any>>
    async put(record: WorkoutType): Promise<WorkoutType | Record<string, any>> {
        const validatedRecord = this.modelSchema.parse(record)
        await this.db.table(TableEnum.WORKOUTS).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the record by id and all associated child records from the database.
     */
    async remove(id: IdType): Promise<WorkoutType>
    async remove(id: IdType): Promise<Record<string, any>>
    async remove(id: IdType): Promise<WorkoutType | Record<string, any>> {
        const recordToDelete = await this.db.table(TableEnum.WORKOUTS).get(id)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.WORKOUTS),
            this.db.table(TableEnum.WORKOUT_RESULTS),
            async () => {
                await this.db.table(TableEnum.WORKOUTS).delete(id)
                await this.db.table(TableEnum.WORKOUT_RESULTS).where('parentId').equals(id).delete()
            },
        )
        return recordToDelete
    }

    /**
     * Imports records into the database using put and returns a results object.
     */
    async importData(records: WorkoutType[]) {
        const validRecords: WorkoutType[] = []
        const invalidRecords: Partial<WorkoutType>[] = []

        // Validate each record
        records.forEach((workout) => {
            if (this.modelSchema.safeParse(workout).success) {
                validRecords.push(this.modelSchema.parse(workout)) // Clean record with parse
            } else {
                invalidRecords.push(workout)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await this.db.table(TableEnum.WORKOUTS).bulkAdd(validRecords)
        } catch (error) {
            bulkError = {
                name: (error as Error)?.name,
                message: (error as Error)?.message,
            }
        }

        // Update lastChild property for each parent record
        const parentIds = validRecords.map((record) => record.id)
        await Promise.all(parentIds.map((parentId) => this.updateLastChild(parentId)))

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
        const records = await this.db.table(TableEnum.WORKOUTS).toArray()
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
     * Updates the `lastChild` property of the record associated with the `parentId` with the
     * most recently created child record. Locked records are not updated.
     */
    async updateLastChild(parentId: IdType) {
        const lastChild = (
            await this.db
                .table(TableEnum.WORKOUT_RESULTS)
                .where('parentId')
                .equals(parentId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await this.db.table(TableEnum.WORKOUTS).update(parentId, { lastChild })
    }

    /**
     * Toggles the favorited status on the record's status property.
     */
    async toggleFavorite(record: WorkoutType) {
        const index = record.status.indexOf(StatusEnum.FAVORITED)
        if (index === -1) {
            record.status.push(StatusEnum.FAVORITED)
        } else {
            record.status.splice(index, 1)
        }
        await this.db.table(TableEnum.WORKOUTS).update(record.id, { status: record.status })
    }

    /**
     * Generates an options list of records for select box components on the FE. Hidden records are
     * not included in the list.
     */
    async getSelectOptions(): Promise<SelectOption[]> {
        const records = await this.db
            .table(TableEnum.WORKOUTS)
            .orderBy('name')
            .filter((record) => !record.status.includes(StatusEnum.HIDDEN))
            .toArray()

        return records.map((record: WorkoutType) => {
            const name = record.name
            const id = truncateText(record.id, 8, '*')
            const favorite = record.status.includes(StatusEnum.FAVORITED) ? '⭐' : ''
            const locked = record.status.includes(StatusEnum.LOCKED) ? '🔒' : ''
            const disable =
                record.status.includes(StatusEnum.LOCKED) ||
                record.status.includes(StatusEnum.HIDDEN)

            return {
                value: record.id as IdType,
                label: `${name} (${id}) ${locked}${favorite}`,
                disable,
            }
        })
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default WorkoutService.instance()
