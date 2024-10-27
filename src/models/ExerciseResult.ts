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

export const setRpeSchema = z.number().int().min(0).max(LimitEnum.MAX_RPE)

export const checklistSetSchema = z.object({
    label: textLineSchema,
    checked: z.boolean(),
})

export const cardioSetSchema = z.object({
    durationSeconds: z.number().int().min(0).max(LimitEnum.MAX_DURATION_SEC),
    caloriesBurned: z.number().int().min(0).max(LimitEnum.MAX_CALORIES_BURNED),
    rpe: setRpeSchema,
})

export const weightSetSchema = z.object({
    weight: z.number().min(0).max(LimitEnum.MAX_WEIGHT), // Can be decimal
    reps: z.number().int().min(0).max(LimitEnum.MAX_REPS),
    rpe: setRpeSchema,
})

export const sidedWeightSetSchema = z.object({
    left: weightSetSchema,
    right: weightSetSchema,
})

// TODO: Still need to think about the design of this
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
    parentId: idSchema,
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

export type SetRpeType = z.infer<typeof setRpeSchema>

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
    parentId: IdType // Parent reference required, never defaulted
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
    parentId: IdType
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
        this.parentId = params.parentId // Parent reference required, never defaulted
        this.note = params.note ?? ''
        this.checklistSets = params.checklistSets ?? undefined
        this.cardioSets = params.cardioSets ?? undefined
        this.weightSets = params.weightSets ?? undefined
        this.sidedWeightSets = params.sidedWeightSets ?? undefined
        this.climbingSets = params.climbingSets ?? undefined
    }
}
