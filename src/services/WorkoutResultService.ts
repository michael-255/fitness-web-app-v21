import DialogChartActivityWorkoutResults from '@/components/dialogs/chart/DialogChartActivityWorkoutResults.vue'
import DialogCreate from '@/components/dialogs/DialogCreate.vue'
import DialogDelete from '@/components/dialogs/DialogDelete.vue'
import DialogEdit from '@/components/dialogs/DialogEdit.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import FormItemCreatedDate from '@/components/dialogs/forms/FormItemCreatedDate.vue'
import FormItemId from '@/components/dialogs/forms/FormItemId.vue'
import FormItemNote from '@/components/dialogs/forms/FormItemNote.vue'
import FormItemParentId from '@/components/dialogs/forms/FormItemParentId.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemList from '@/components/dialogs/inspect/InspectItemList.vue'
import InspectItemString from '@/components/dialogs/inspect/InspectItemString.vue'
import WorkoutResult, { workoutResultSchema, type WorkoutResultType } from '@/models/WorkoutResult'
import { StatusEnum, TableEnum } from '@/shared/enums'
import { databaseIcon } from '@/shared/icons'
import type { IdType, SelectOption, ServiceType } from '@/shared/types'
import { hiddenTableColumn, tableColumn, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import type { QDialogOptions } from 'quasar'
import BaseService from './BaseService'
import { WorkoutService } from './WorkoutService'

/**
 * Singleton class for managing most aspects of the Workout Result model.
 */
export class WorkoutResultService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Workout Result'
    labelPlural = 'Workout Results'
    modelSchema = workoutResultSchema
    table = TableEnum.WORKOUT_RESULTS
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('parentId', 'Parent Workout Id', 'UUID'),
        tableColumn('note', 'Note', 'TEXT'),
        tableColumn('status', 'Status', 'LIST-PRINT'),
    ]
    displayIcon = databaseIcon
    tableIcon = databaseIcon
    supportsTableColumnFilters = true
    supportsActivityCharts = true
    supportsCharts = false
    supportsInspect = true
    supportsCreate = true
    supportsEdit = true
    supportsDelete = true

    /**
     * Returns the parent service for this child service.
     */
    parentService(): ServiceType {
        return WorkoutService.instance()
    }

    /**
     * Returns QDialogOptions options for the chart dialog.
     * @example $q.dialog(service.activityChartsDialogOptions(id))
     */
    activityChartsDialogOptions(): QDialogOptions {
        return { component: DialogChartActivityWorkoutResults }
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
                        props: { label: 'Parent Example Id', recordKey: 'parentId' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Note', recordKey: 'note' },
                    },
                    {
                        component: InspectItemList,
                        props: { label: 'Status', recordKey: 'status' },
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
    createDialogOptions(parentId?: IdType): QDialogOptions {
        let record: WorkoutResult = null!

        if (parentId) {
            record = new WorkoutResult({ parentId })
        } else {
            record = new WorkoutResult({ parentId: undefined! })
        }

        return {
            component: DialogCreate,
            componentProps: {
                service: this,
                initialRecord: record,
                formComponents: [
                    { component: FormItemId },
                    { component: FormItemParentId, props: { parentService: this.parentService() } },
                    { component: FormItemCreatedDate },
                    { component: FormItemNote },
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
                    { component: FormItemParentId, props: { parentService: this.parentService() } },
                    { component: FormItemCreatedDate },
                    { component: FormItemNote },
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
     * Returns chart datasets for the record associated with a parent.
     * TODO: Implement for charts.
     */
    async getChartDatasets(parentId: IdType) {
        console.log('getChartDatasets', parentId)
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
     * Returns record by ID.
     */
    async get(id: IdType): Promise<WorkoutResultType>
    async get(id: IdType): Promise<Record<string, any>>
    async get(id: IdType): Promise<WorkoutResultType | Record<string, any>> {
        const recordToGet = await this.db.table(TableEnum.WORKOUT_RESULTS).get(id)
        if (!recordToGet) {
            throw new Error(`${this.labelSingular} ID not found: ${id}`)
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
                await this.updateLastChild(validatedRecord.parentId)
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
                await this.updateLastChild(validatedRecord.parentId)
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
                await this.updateLastChild(recordToDelete.parentId)
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

        // Update parent lastChild property
        const parentIds = Array.from(new Set(validRecords.map((record) => record.parentId)))
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
     * From Child:
     *
     * Updates the `lastChild` property of the parent model associated with the `parentId` with the
     * most recently created child model. Locked records are not updated.
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
            const parentId = truncateText(record.parentId, 8, '*')
            const locked = record.status.includes(StatusEnum.LOCKED) ? '🔒' : ''
            const disable = record.status.includes(StatusEnum.LOCKED)

            return {
                value: record.id as IdType,
                label: `${id} (${parentId}) ${locked}`,
                disable,
            }
        })
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default WorkoutResultService.instance()
