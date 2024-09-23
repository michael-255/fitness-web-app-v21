import type { z } from 'zod'
import type { exerciseGroupSchema, workoutSchema } from '../schemas/workout'

//
// Fields
//
export type ExerciseGroupType = z.infer<typeof exerciseGroupSchema>

//
// Model
//
export type WorkoutType = z.infer<typeof workoutSchema>
