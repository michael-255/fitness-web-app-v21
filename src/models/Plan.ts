import { timestampSchema } from '@/shared/schemas'
import type { TimestampType } from '@/shared/types'
import { z } from 'zod'

//
// Enums
//

/**
 * The only valid keys for plans in the application.
 */
export enum PlanKeyEnum {
    // Specific weekday recurring
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday',
    // Specific month recurring
    JANUARY = 'January',
    FEBRUARY = 'February',
    MARCH = 'March',
    APRIL = 'April',
    MAY = 'May',
    JUNE = 'June',
    JULY = 'July',
    AUGUST = 'August',
    SEPTEMBER = 'September',
    OCTOBER = 'October',
    NOVEMBER = 'November',
    DECEMBER = 'December',
    // Long term recurring
    MONTHLY = 'Monthly',
    YEARLY = 'Yearly',
}

//
// Schemas
//

export const planKeySchema = z.nativeEnum(PlanKeyEnum)

export const planSchema = z.object({
    key: planKeySchema,
    createdAt: timestampSchema,
    // TODO
})

//
// Types
//

export type PlanKeyType = z.infer<typeof planKeySchema>

export type PlanType = z.infer<typeof planSchema>

interface PlanParams {
    key: PlanKeyType
    createdAt?: TimestampType
    // TODO
}

/**
 * `Plan` standalone model.
 *
 *  Represents all relevant details of a plan.
 */
export default class Plan {
    key: PlanKeyType
    createdAt: TimestampType

    constructor(params: PlanParams) {
        this.key = params.key
        this.createdAt = params.createdAt ?? Date.now()
        // TODO
    }
}
