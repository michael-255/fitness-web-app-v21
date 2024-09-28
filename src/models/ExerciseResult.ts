import { LimitEnum, TableEnum } from '@/shared/enums'
import {
    idSchema,
    statusListSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from '@/shared/schemas'
import type { IdType, StatusType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import { z } from 'zod'

//
// Schemas
//

export const setWeightSchema = z
    .number()
    .min(LimitEnum.MIN_SET_WEIGHT)
    .max(LimitEnum.MAX_SET_WEIGHT)

export const setRepsSchema = z
    .number()
    .int()
    .min(LimitEnum.MIN_SET_REPS)
    .max(LimitEnum.MAX_SET_REPS)

export const setRpeSchema = z.number().int().min(LimitEnum.MIN_SET_RPE).max(LimitEnum.MAX_SET_RPE)

export const checklistSetSchema = z.object({
    label: textLineSchema,
    checked: z.boolean(),
})

export const cardioSetSchema = z.object({
    duration: z.number().int(), // TODO
    calories: z.number().int(), // TODO
    rpe: setRpeSchema,
})

export const weightSetSchema = z.object({
    weight: setWeightSchema,
    reps: setRepsSchema,
    rpe: setRpeSchema,
})

export const sidedWeightSetSchema = z.object({
    left: weightSetSchema,
    right: weightSetSchema,
})

export const climbingSetSchema = z.object({
    listedGrade: z.any(), // TODO
    myGrade: z.any(), // TODO
    styles: z.any(), // TODO
    image: z.any(), // TODO
    attempts: z.any(), // TODO
    topped: z.boolean(),
})

export const exerciseResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    exerciseId: idSchema,
    note: textAreaSchema,
    checklistSets: z.array(checklistSetSchema).optional(),
    cardioSets: z.array(cardioSetSchema).optional(),
    weightSets: z.array(weightSetSchema).optional(),
    sidedWeightSets: z.array(sidedWeightSetSchema).optional(),
    climbingSets: z.array(climbingSetSchema).optional(),
})

//
// Types
//

export type SetWeightType = z.infer<typeof setWeightSchema>

export type SetRepsType = z.infer<typeof setRepsSchema>

export type ChecklistSetType = z.infer<typeof checklistSetSchema>

export type CardioSetType = z.infer<typeof cardioSetSchema>

export type WeightSetType = z.infer<typeof weightSetSchema>

export type SidedWeightSetType = z.infer<typeof sidedWeightSetSchema>

export type ClimbingSetType = z.infer<typeof climbingSetSchema>

export type ExerciseResultType = z.infer<typeof exerciseResultSchema>

interface ExerciseResultParams {
    id?: IdType
    createdAt?: TimestampType
    status?: StatusType[]
    exerciseId: IdType // Parent reference required, never defaulted
    note?: TextAreaType
    checklistSets?: ChecklistSetType[]
    cardioSets?: CardioSetType[]
    weightSets?: WeightSetType[]
    sidedWeightSets?: SidedWeightSetType[]
    climbingSets?: ClimbingSetType[]
}

/**
 * `ExerciseResult` child model.
 *
 *  Represents the results of an exercise. This references the sets and their results.
 */
export default class ExerciseResult {
    id: IdType
    createdAt: TimestampType
    status: StatusType[]
    exerciseId: IdType
    note: TextAreaType
    checklistSets?: ChecklistSetType[]
    cardioSets?: CardioSetType[]
    weightSets?: WeightSetType[]
    sidedWeightSets?: SidedWeightSetType[]
    climbingSets?: ClimbingSetType[]

    constructor(params: ExerciseResultParams) {
        this.id = params.id ?? createId(TableEnum.EXERCISE_RESULTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.status = params.status ?? []
        this.exerciseId = params.exerciseId // Parent reference required, never defaulted
        this.note = params.note ?? ''
        this.checklistSets = params.checklistSets ?? undefined
        this.cardioSets = params.cardioSets ?? undefined
        this.weightSets = params.weightSets ?? undefined
        this.sidedWeightSets = params.sidedWeightSets ?? undefined
        this.climbingSets = params.climbingSets ?? undefined
    }
}
