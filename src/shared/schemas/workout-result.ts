import { z } from 'zod'
import { flagListSchema, idSchema, textAreaSchema, timestampSchema } from './shared'

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
    flags: flagListSchema,
    workoutId: idSchema,
    note: textAreaSchema,
    finishedAt: timestampSchema.optional(),
    warmupResultGroups: z.array(exerciseResultGroupSchema),
    cooldownResultGroups: z.array(exerciseResultGroupSchema),
    exerciseResultGroups: z.array(exerciseResultGroupSchema),
})
