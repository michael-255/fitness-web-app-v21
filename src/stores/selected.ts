import type { ExerciseType } from '@/shared/types/exercise'
import type { ExerciseResultType } from '@/shared/types/exercise-result'
import type { LogType } from '@/shared/types/log'
import type { MeasurementType } from '@/shared/types/measurement'
import type { WorkoutType } from '@/shared/types/workout'
import type { WorkoutResultType } from '@/shared/types/workout-result'
import { defineStore } from 'pinia'

/**
 * Storing the currently selected records for any form and whether it is valid.
 */
const useSelectedStore = defineStore({
    id: 'selected',

    state: () => ({
        isLogValid: true,
        isMeasurementValid: true,
        isMeasurementResultValid: true,
        isWorkoutValid: true,
        isWorkoutResultValid: true,
        isExerciseValid: true,
        isExerciseResultValid: true,
        log: {} as LogType, // Only needs this for inspection
        measurement: {} as MeasurementType,
        workout: {} as WorkoutType,
        workoutResult: {} as WorkoutResultType,
        exercise: {} as ExerciseType,
        exerciseResult: {} as ExerciseResultType,
    }),
})

export default useSelectedStore
