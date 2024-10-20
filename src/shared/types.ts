import type { ExerciseType } from '@/models/Exercise'
import type { ExerciseResultType } from '@/models/ExerciseResult'
import type { LogType } from '@/models/Log'
import type { MeasurementType } from '@/models/Measurements'
import type { SettingType } from '@/models/Setting'
import type { WorkoutType } from '@/models/Workout'
import type { WorkoutResultType } from '@/models/WorkoutResult'
import type { ExerciseResultService } from '@/services/ExerciseResultService'
import type { ExerciseService } from '@/services/ExerciseService'
import type { LogService } from '@/services/LogService'
import type { MeasurementService } from '@/services/MeasurementService'
import type { SettingService } from '@/services/SettingService'
import type { WorkoutResultService } from '@/services/WorkoutResultService'
import type { WorkoutService } from '@/services/WorkoutService'
import type { Component } from 'vue'
import { z } from 'zod'
import type {
    idSchema,
    routeNameSchema,
    statusSchema,
    tableSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from './schemas'

//
// App
//

export type TableType = z.infer<typeof tableSchema>

export type RouteNameType = z.infer<typeof routeNameSchema>

export type RouteServiceType =
    | SettingService
    | LogService
    | WorkoutService
    | WorkoutResultService
    | ExerciseService
    | ExerciseResultService
    | MeasurementService

//
// Common
//

export type IdType = z.infer<typeof idSchema>

export type TimestampType = z.infer<typeof timestampSchema>

export type TextLineType = z.infer<typeof textLineSchema>

export type TextAreaType = z.infer<typeof textAreaSchema>

export type StatusType = z.infer<typeof statusSchema>

//
// Database
//

export type BackupType = {
    appName: string
    databaseVersion: string
    createdAt: number
    settings: SettingType[]
    logs: LogType[]
    measurements: MeasurementType[]
    workouts: WorkoutType[]
    workoutResults: WorkoutResultType[]
    exercises: ExerciseType[]
    exerciseResults: ExerciseResultType[]
}

//
// Frontend
//

export type SelectOption = {
    value: IdType
    label: string
    disable: boolean
}

export type DialogComponentType = {
    component: Component
    componentProps: Record<string, any>
}
