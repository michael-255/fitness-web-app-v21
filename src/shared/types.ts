import type { ExerciseType } from '@/models/Exercise'
import type { ExerciseResultType } from '@/models/ExerciseResult'
import type { MeasurementType } from '@/models/Measurements'
import type { SettingType } from '@/models/Setting'
import type { WorkoutType } from '@/models/Workout'
import type { WorkoutResultType } from '@/models/WorkoutResult'
import type BaseService from '@/services/BaseService'
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

export type ServiceType = InstanceType<new (...args: any[]) => BaseService>

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
    createdAt: TimestampType
    // Logs are ignored
    settings: SettingType[]
    dailyPlans: DailyPlanType[]
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

export type ComponentWithPropsType = {
    component: Component
    props?: Record<string, any>
}
