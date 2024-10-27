import { planSchema } from '@/models/Plan'
import { TableEnum } from '@/shared/enums'
import { calendarCheckIcon, databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
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
}

/**
 * Singleton instance exported as default for convenience.
 */
export default PlanService.instance()
