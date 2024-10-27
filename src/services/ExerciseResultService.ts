import DialogChartActivityExerciseResults from '@/components/dialogs/chart/DialogChartActivityExerciseResults.vue'
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
import ExerciseResult, {
    exerciseResultSchema,
    type ExerciseResultType,
} from '@/models/ExerciseResult'
import { StatusEnum, TableEnum } from '@/shared/enums'
import { databaseIcon } from '@/shared/icons'
import type { IdType, SelectOption, ServiceType } from '@/shared/types'
import { hiddenTableColumn, tableColumn, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import type { QDialogOptions } from 'quasar'
import BaseService from './BaseService'
import { ExerciseService } from './ExerciseService'

/**
 * Singleton class for managing most aspects of the Exercise Result model.
 */
export class ExerciseResultService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Exercise Result'
    labelPlural = 'Exercise Results'
    modelSchema = exerciseResultSchema
    table = TableEnum.EXERCISE_RESULTS
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('parentId', 'Parent Exercise Id', 'UUID'),
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
        return ExerciseService.instance()
    }

    /**
     * Returns QDialogOptions options for the chart dialog.
     * @example $q.dialog(service.activityChartsDialogOptions(id))
     */
    activityChartsDialogOptions(): QDialogOptions {
        return { component: DialogChartActivityExerciseResults }
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
        let record: ExerciseResult = null!

        if (parentId) {
            record = new ExerciseResult({ parentId })
        } else {
            record = new ExerciseResult({ parentId: undefined! })
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
     * Returns chart datasets for the records associated with a parent.
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
     * Returns record by ID.
     */
    async get(id: IdType): Promise<ExerciseResultType>
    async get(id: IdType): Promise<Record<string, any>>
    async get(id: IdType): Promise<ExerciseResultType | Record<string, any>> {
        const recordToGet = await this.db.table(TableEnum.EXERCISE_RESULTS).get(id)
        if (!recordToGet) {
            throw new Error(`${this.labelSingular} ID not found: ${id}`)
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
                await this.updateLastChild(validatedRecord.parentId)
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
                await this.updateLastChild(validatedRecord.parentId)
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
                await this.updateLastChild(recordToDelete.parentId)
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
                .table(TableEnum.EXERCISE_RESULTS)
                .where('parentId')
                .equals(parentId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await this.db.table(TableEnum.EXERCISES).update(parentId, { lastChild })
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
export default ExerciseResultService.instance()
