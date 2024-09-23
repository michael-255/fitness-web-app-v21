import { z } from 'zod'
import { LimitEnum } from '../enums'
import { flagListSchema, idSchema, textAreaSchema, textLineSchema, timestampSchema } from './shared'

//
// Fields
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

//
// Model
//
export const exerciseResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    flags: flagListSchema,
    exerciseId: idSchema,
    note: textAreaSchema,
    checklistSets: z.array(checklistSetSchema).optional(),
    cardioSets: z.array(cardioSetSchema).optional(),
    weightSets: z.array(weightSetSchema).optional(),
    sidedWeightSets: z.array(sidedWeightSetSchema).optional(),
    climbingSets: z.array(climbingSetSchema).optional(),
})
