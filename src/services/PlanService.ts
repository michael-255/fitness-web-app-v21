import { planSchema, type PlanType } from '@/models/Plan'
import { TableEnum } from '@/shared/enums'
import { calendarCheckIcon, databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Exercise model.
 */
export class PlanService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Plan'
    labelPlural = 'Plans'
    modelSchema = planSchema
    table = TableEnum.EXERCISES
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
    ]
    displayIcon = calendarCheckIcon
    tableIcon = databaseIcon
    supportsTableColumnFilters = false
    supportsActivityCharts = true
    supportsCharts = false
    supportsInspect = false
    supportsCreate = false
    supportsEdit = false
    supportsDelete = false

    /**
     * Returns live query with records that are not hidden with the remaining sorted with
     * locked records first, then favorited records, then alphabetically by name, and finally
     * by createdAt reversed.
     */
    liveDashboard(): Observable<PlanType[]>
    liveDashboard(): Observable<Record<string, any>[]>
    liveDashboard(): Observable<PlanType[] | Record<string, any>[]> {
        return liveQuery(() => this.db.table(TableEnum.PLANS).toArray())
    }

    /**
     * Returns live query or records ordered by name.
     */
    liveTable(): Observable<PlanType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<PlanType[] | Record<string, any>[]> {
        return liveQuery(() => this.db.table(TableEnum.PLANS).toArray())
    }

    /**
     * Function that takes a type of T that has a status property and adds HIDDEN to the property
     * and returns the type.
     * @todo Testing out a better way to do my functions!
     * @example
     * ```ts
     * type TestRecord = { status: string, id: string }
     * const record1 = { status: 'ACTIVE'}
     * const record2 = { status: 'ACTIVE', id: '123' }
     * const fail = PlanService.instance().hide<TestRecord>(record1)
     * const succeed = PlanService.instance().hide<TestRecord>(record2)
     * ```
     */
    hide<T extends { status: string }>(record: T): T {
        record.status = 'HIDDEN'
        return record
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default PlanService.instance()

type TestRecord = { status: string; id: string }
const bad = { status: 'ACTIVE' }
const good = { status: 'ACTIVE', id: '123' }
const fail = PlanService.instance().hide<TestRecord>(bad)
const succeed = PlanService.instance().hide<TestRecord>(good)
