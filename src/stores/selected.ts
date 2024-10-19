import type { ExerciseType } from '@/models/Exercise'
import type { ExerciseResultType } from '@/models/ExerciseResult'
import type { LogType } from '@/models/Log'
import type { MeasurementType } from '@/models/Measurements'
import type { WorkoutType } from '@/models/Workout'
import type { WorkoutResultType } from '@/models/WorkoutResult'
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
        record: {} as Record<string, any>,
    }),
})

export default useSelectedStore
