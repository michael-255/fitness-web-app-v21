import { TableEnum } from '@/shared/enums'
import type { IdType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

//
// Enums
//

//
// Schemas
//

//
// Types
//

interface DailyPlanParams {
    id?: IdType
    createdAt?: TimestampType
}

/**
 * `Exercise` parent model.
 *
 *  Represents all relevant details of an exercise.
 */
export default class DailyPlan {
    id: IdType
    createdAt: TimestampType

    constructor(params: DailyPlanParams) {
        this.id = params.id ?? createId(TableEnum.DAILY_PLANS)
        this.createdAt = params.createdAt ?? Date.now()
    }
}
