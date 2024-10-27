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

export const planSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    // TODO
})

//
// Types
//

export type PlanType = z.infer<typeof planSchema>

interface PlanParams {
    id?: IdType
    createdAt?: TimestampType
}

/**
 * `Plan` standalone model.
 *
 *  Represents all relevant details of a plan.
 */
export default class Plan {
    id: IdType
    createdAt: TimestampType

    constructor(params: PlanParams) {
        this.id = params.id ?? createId(TableEnum.PLANS)
        this.createdAt = params.createdAt ?? Date.now()
        // TODO
    }
}
