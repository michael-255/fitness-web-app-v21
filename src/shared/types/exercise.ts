import type { z } from 'zod'
import type {
    exerciseInputSchema,
    exerciseSchema,
    initialSetCountSchema,
    restTimerSchema,
    tabataTimerSchema,
} from '../schemas/exercise'

//
// Fields
//
export type ExerciseInputType = z.infer<typeof exerciseInputSchema>

export type InitialSetCountType = z.infer<typeof initialSetCountSchema>

export type RestTimerType = z.infer<typeof restTimerSchema>

export type TabataTimerType = z.infer<typeof tabataTimerSchema>

//
// Model
//
export type ExerciseType = z.infer<typeof exerciseSchema>
