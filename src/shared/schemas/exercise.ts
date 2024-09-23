import { z } from 'zod'
import { ExerciseInputEnum, LimitEnum } from '../enums'
import { exerciseResultSchema } from './exercise-result'
import { flagListSchema, idSchema, textAreaSchema, textLineSchema, timestampSchema } from './shared'

//
// Fields
//
export const exerciseInputSchema = z.nativeEnum(ExerciseInputEnum)

export const initialSetCountSchema = z
    .number()
    .int()
    .min(LimitEnum.MIN_SETS)
    .max(LimitEnum.MAX_SETS)

export const restTimerSchema = z.object({
    defaultDuration: z.number().int(), // TODO
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

//
// Model
//
export const exerciseSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    flags: flagListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: exerciseResultSchema.optional(),
    inputs: exerciseInputSchema,
    initialSetCount: initialSetCountSchema,
    restTimer: restTimerSchema.optional(),
    tabataTimer: tabataTimerSchema.optional(),
})
