import { exerciseSchema } from '@/models/Exercise'
import { TableEnum } from '@/shared/enums'
import { databaseIcon, exercisesPageIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Exercise model.
 */
export class DailyPlanService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Exercise'
    labelPlural = 'Exercises'
    modelSchema = exerciseSchema
    table = TableEnum.EXERCISES
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
    ]
    displayIcon = exercisesPageIcon // TODO
    tableIcon = databaseIcon // TODO
    supportsTableColumnFilters = false
    supportsActivityCharts = false
    supportsCharts = false
    supportsInspect = false
    supportsCreate = false
    supportsEdit = false
    supportsDelete = false
}

/**
 * Singleton instance exported as default for convenience.
 */
export default DailyPlanService.instance()
