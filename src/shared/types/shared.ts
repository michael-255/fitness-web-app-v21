import { z } from 'zod'
import type {
    flagSchema,
    idSchema,
    routeNameSchema,
    tableSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from '../schemas/shared'
import type { ExerciseType } from './exercise'
import type { ExerciseResultType } from './exercise-result'
import type { LogType } from './log'
import type { MeasurementFieldType } from './measurement'
import type { SettingType } from './setting'
import type { WorkoutType } from './workout'
import type { WorkoutResultType } from './workout-result'

//
// App
//
export type TableType = z.infer<typeof tableSchema>

export type RouteNameType = z.infer<typeof routeNameSchema>

//
// Shared
//
export type IdType = z.infer<typeof idSchema>

export type TimestampType = z.infer<typeof timestampSchema>

export type TextLineType = z.infer<typeof textLineSchema>

export type TextAreaType = z.infer<typeof textAreaSchema>

export type FlagType = z.infer<typeof flagSchema>

//
// Database
//
export type BackupType = {
    appName: string
    databaseVersion: string
    createdAt: number
    settings: SettingType[]
    logs: LogType[]
    measurements: MeasurementFieldType[]
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
