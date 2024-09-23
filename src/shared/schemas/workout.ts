import { z } from 'zod'
import { flagListSchema, idSchema, textAreaSchema, textLineSchema, timestampSchema } from './shared'
import { workoutResultSchema } from './workout-result'

//
// Fields
//
export const exerciseGroupSchema = z.object({
    exerciseIds: z.array(idSchema), // 2+ means it's a superset
})

//
// Model
//
export const workoutSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    flags: flagListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: workoutResultSchema.optional(),
    warmupGroups: z.array(exerciseGroupSchema),
    cooldownGroups: z.array(exerciseGroupSchema),
    exerciseGroups: z.array(exerciseGroupSchema),
    nextWorkoutIds: z.array(idSchema),
})
