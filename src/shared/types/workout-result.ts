import type { z } from 'zod'
import type { exerciseResultGroupSchema, workoutResultSchema } from '../schemas/workout-result'

//
// Fields
//
export type ExerciseResultGroupType = z.infer<typeof exerciseResultGroupSchema>

//
// Model
//
export type WorkoutResultType = z.infer<typeof workoutResultSchema>
