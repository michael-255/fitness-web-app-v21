import { LimitEnum, StatusEnum, TableEnum } from '@/shared/enums'
import {
    idSchema,
    statusListSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from '@/shared/schemas'
import type { IdType, StatusType, TextAreaType, TextLineType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import { z } from 'zod'
import { exerciseResultSchema, type ExerciseResultType } from './ExerciseResult'

//
// Enums
//

/**
 * Used to determine the type of inputs available for an exercise.
 */
export enum ExerciseInputEnum {
    CHECKLIST = 'Checklist', // Check boxes, all optional
    CARDIO = 'Cardio Exercise', // Duration, Calories, RPE
    WEIGHT = 'Weight Exercise', // Reps, Weight, RPE
    SIDED_WEIGHT = 'Sided Weight Exercise', // Reps (R/L), Weight (R/L), RPE (R/L)
    CLIMBING_SESSION = 'Climbing Session',
}

//
// Schemas
//

export const exerciseInputSchema = z.nativeEnum(ExerciseInputEnum)

export const initialSetCountSchema = z
    .number()
    .int()
    .min(LimitEnum.MIN_SETS)
    .max(LimitEnum.MAX_SETS)

/**
 * Rest timer minimum is 15 seconds and maximum is 15 minutes.
 * Timer should be incremented by 15 seconds.
 */
export const restTimerSchema = z.object({
    defaultDurationSeconds: z
        .number()
        .int()
        .min(LimitEnum.MIN_REST_TIMER)
        .max(LimitEnum.MAX_REST_TIMER),
})

export const tabataTimerSchema = z.object({
    prepare: z.number().int(), // TODO
    work: z.number().int(), // TODO
    rest: z.number().int(), // TODO
    sets: z.number().int(), // TODO
    rounds: z.number().int(), // TODO
    restBetweenSets: z.number().int(), // TODO
    restBetweenRounds: z.number().int(), // TODO
})

export const exerciseSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: exerciseResultSchema.optional(),
    inputs: exerciseInputSchema,
    initialSetCount: initialSetCountSchema,
    restTimer: restTimerSchema.optional(),
    tabataTimer: tabataTimerSchema.optional(),
})

//
// Types
//

export type ExerciseInputType = z.infer<typeof exerciseInputSchema>

export type InitialSetCountType = z.infer<typeof initialSetCountSchema>

export type RestTimerType = z.infer<typeof restTimerSchema>

export type TabataTimerType = z.infer<typeof tabataTimerSchema>

export type ExerciseType = z.infer<typeof exerciseSchema>

interface ExerciseParams {
    id?: IdType
    createdAt?: TimestampType
    status?: StatusType[]
    name?: TextLineType
    desc?: TextAreaType
    lastChild?: ExerciseResultType
    inputs: ExerciseInputType // Required
    initialSetCount?: InitialSetCountType
    restTimer?: RestTimerType
    tabataTimer?: TabataTimerType
}

/**
 * `Exercise` parent model.
 *
 *  Represents all relevant details of an exercise.
 */
export default class Exercise {
    id: IdType
    createdAt: TimestampType
    status: StatusType[]
    name: TextLineType
    desc: TextAreaType
    lastChild?: ExerciseResultType
    inputs: ExerciseInputType
    initialSetCount: InitialSetCountType
    restTimer?: RestTimerType
    tabataTimer?: TabataTimerType

    constructor(params: ExerciseParams) {
        this.id = params.id ?? createId(TableEnum.EXERCISES)
        this.createdAt = params.createdAt ?? Date.now()
        this.status = params.status ?? [StatusEnum.ENABLED]
        this.name = params.name ?? 'My Exercise'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
        this.inputs = params.inputs // Required, not defaulted
        this.initialSetCount = params.initialSetCount ?? 1
        this.restTimer = params.restTimer ?? undefined
        this.tabataTimer = params.tabataTimer ?? undefined
    }
}
