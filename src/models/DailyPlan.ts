import { TableEnum } from '@/shared/enums'
import { idSchema, timestampSchema } from '@/shared/schemas'
import type { IdType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import { z } from 'zod'

//
// Enums
//

//
// Schemas
//

export const dailyPlanSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    // TODO
})

//
// Types
//

export type DailyPlanType = z.infer<typeof dailyPlanSchema>

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
        // TODO
    }
}
