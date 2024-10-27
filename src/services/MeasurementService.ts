import DialogChartActivityMeasurements from '@/components/dialogs/chart/DialogChartActivityMeasurements.vue'
import DialogChartMeasurement from '@/components/dialogs/chart/DialogChartMeasurement.vue'
import DialogCreate from '@/components/dialogs/DialogCreate.vue'
import DialogDelete from '@/components/dialogs/DialogDelete.vue'
import DialogEdit from '@/components/dialogs/DialogEdit.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import FormItemCreatedDate from '@/components/dialogs/forms/FormItemCreatedDate.vue'
import FormItemId from '@/components/dialogs/forms/FormItemId.vue'
import FormItemNote from '@/components/dialogs/forms/FormItemNote.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemString from '@/components/dialogs/inspect/InspectItemString.vue'
import Measurement, { measurementSchema, type MeasurementType } from '@/models/Measurements'
import { TableEnum } from '@/shared/enums'
import { databaseIcon, measurementsPageIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import type { QDialogOptions } from 'quasar'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Measurement model.
 */
export class MeasurementService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Measurement'
    labelPlural = 'Measurements'
    modelSchema = measurementSchema
    table = TableEnum.MEASUREMENTS
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('note', 'Note', 'TEXT'),
        // TODO
    ]
    displayIcon = measurementsPageIcon
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
        return { component: DialogChartActivityMeasurements }
    }

    /**
     * Returns QDialogOptions options for the chart dialog.
     * @example $q.dialog(service.chartsDialogOptions(id))
     */
    chartsDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogChartMeasurement,
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
                        props: { label: 'Note', recordKey: 'note' },
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
                initialRecord: new Measurement({ field: undefined! }),
                formComponents: [
                    { component: FormItemId },
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
     * Returns live query or records ordered by creation date.
     */
    liveTable(): Observable<MeasurementType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<MeasurementType[] | Record<string, any>[]> {
        return liveQuery(() =>
            this.db.table(TableEnum.MEASUREMENTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns record by ID.
     */
    async get(id: IdType): Promise<MeasurementType>
    async get(id: IdType): Promise<Record<string, any>>
    async get(id: IdType): Promise<MeasurementType | Record<string, any>> {
        const recordToGet = await this.db.table(TableEnum.MEASUREMENTS).get(id)
        if (!recordToGet) {
            throw new Error(`${this.labelSingular} ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new record in the database.
     */
    async add(exercise: MeasurementType): Promise<MeasurementType>
    async add(exercise: MeasurementType): Promise<Record<string, any>>
    async add(exercise: MeasurementType): Promise<MeasurementType | Record<string, any>> {
        const validatedRecord = measurementSchema.parse(exercise)
        await this.db.table(TableEnum.MEASUREMENTS).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites a record in the database.
     */
    async put(record: MeasurementType): Promise<MeasurementType>
    async put(record: MeasurementType): Promise<Record<string, any>>
    async put(record: MeasurementType): Promise<MeasurementType | Record<string, any>> {
        const validatedRecord = measurementSchema.parse(record)
        await this.db.table(TableEnum.MEASUREMENTS).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the record by ID.
     */
    async remove(id: IdType): Promise<MeasurementType>
    async remove(id: IdType): Promise<Record<string, any>>
    async remove(id: IdType): Promise<MeasurementType | Record<string, any>> {
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
export default MeasurementService.instance()
