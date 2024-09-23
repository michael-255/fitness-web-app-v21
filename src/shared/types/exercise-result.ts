import type { z } from 'zod'
import type {
    cardioSetSchema,
    checklistSetSchema,
    climbingSetSchema,
    exerciseResultSchema,
    setRepsSchema,
    setWeightSchema,
    sidedWeightSetSchema,
    weightSetSchema,
} from '../schemas/exercise-result'

//
// Fields
//
export type SetWeightType = z.infer<typeof setWeightSchema>

export type SetRepsType = z.infer<typeof setRepsSchema>

export type ChecklistSetType = z.infer<typeof checklistSetSchema>

export type CardioSetType = z.infer<typeof cardioSetSchema>

export type WeightSetType = z.infer<typeof weightSetSchema>

export type SidedWeightSetType = z.infer<typeof sidedWeightSetSchema>

export type ClimbingSetType = z.infer<typeof climbingSetSchema>

//
// Model
//
export type ExerciseResultType = z.infer<typeof exerciseResultSchema>
