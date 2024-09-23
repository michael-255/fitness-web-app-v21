import { z } from 'zod'
import { idSchema, statusListSchema, textAreaSchema, timestampSchema } from './shared'

//
// Fields
//
export const exerciseResultGroupSchema = z.object({
    exerciseResultIds: z.array(idSchema.optional()), // undefined = exercise skipped or missing
})

//
// Model
//
export const workoutResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    workoutId: idSchema,
    note: textAreaSchema,
    finishedAt: timestampSchema.optional(),
    warmupResultGroups: z.array(exerciseResultGroupSchema),
    cooldownResultGroups: z.array(exerciseResultGroupSchema),
    exerciseResultGroups: z.array(exerciseResultGroupSchema),
})
