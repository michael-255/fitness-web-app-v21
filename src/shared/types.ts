import type {
    bloodPressureSchema,
    bodyMassIndexSchema,
    bodyMeasurementSchema,
    bodyWeightSchema,
    caloriesSchema,
    cardioSetSchema,
    checklistSetSchema,
    climbingSetSchema,
    exampleResultSchema,
    exampleSchema,
    exerciseGroupSchema,
    exerciseInputSchema,
    exerciseResultGroupSchema,
    exerciseResultSchema,
    exerciseSchema,
    idSchema,
    initialSetCountSchema,
    logAutoIdSchema,
    logDetailsSchema,
    logLabelSchema,
    logLevelSchema,
    logSchema,
    measurementFieldSchema,
    mockDataSchema,
    nutritionSchema,
    optionalTimestampSchema,
    percentSchema,
    restTimerSchema,
    routeNameSchema,
    settingKeySchema,
    settingSchema,
    settingValueSchema,
    sidedWeightSetSchema,
    tabataTimerSchema,
    tableSchema,
    tagSchema,
    temperatureSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
    weightSetSchema,
    workoutResultSchema,
    workoutSchema,
} from '@/shared/schemas'
import { z } from 'zod'

//
// App
//
export type TableType = z.infer<typeof tableSchema>

export type RouteNameType = z.infer<typeof routeNameSchema>

//
// Setting
//
export type SettingType = z.infer<typeof settingSchema>

export type SettingKeyType = z.infer<typeof settingKeySchema>

export type SettingValueType = z.infer<typeof settingValueSchema>

//
// Log
//
export type LogType = z.infer<typeof logSchema>

export type LogAutoIdType = z.infer<typeof logAutoIdSchema>

export type LogLevelType = z.infer<typeof logLevelSchema>

export type LogLabelType = z.infer<typeof logLabelSchema>

export type LogDetailsType = z.infer<typeof logDetailsSchema>

//
// Models
//
export type ExampleType = z.infer<typeof exampleSchema> // TODO: Remove

export type ExampleResultType = z.infer<typeof exampleResultSchema> // TODO: Remove

export type MockDataType = z.infer<typeof mockDataSchema> // TODO: Remove

//
// Shared
//
export type IdType = z.infer<typeof idSchema>

export type TimestampType = z.infer<typeof timestampSchema>

export type OptionalTimestampType = z.infer<typeof optionalTimestampSchema>

export type TextLineType = z.infer<typeof textLineSchema>

export type TextAreaType = z.infer<typeof textAreaSchema>

export type TagType = z.infer<typeof tagSchema>

//
// Measurements
//
export type MeasurementFieldType = z.infer<typeof measurementFieldSchema>

export type CaloriesType = z.infer<typeof caloriesSchema>

export type NutritionType = z.infer<typeof nutritionSchema>

export type BodyWeightType = z.infer<typeof bodyWeightSchema>

export type PercentType = z.infer<typeof percentSchema>

export type BodyMassIndexType = z.infer<typeof bodyMassIndexSchema>

export type TemperatureType = z.infer<typeof temperatureSchema>

export type BloodPressureType = z.infer<typeof bloodPressureSchema>

export type BodyMeasurementType = z.infer<typeof bodyMeasurementSchema>

//
// Workouts
//
export type WorkoutType = z.infer<typeof workoutSchema>

export type WorkoutResultType = z.infer<typeof workoutResultSchema>

export type ExerciseGroupType = z.infer<typeof exerciseGroupSchema>

export type ExerciseResultGroupType = z.infer<typeof exerciseResultGroupSchema>

//
// Exercises
//
export type ExerciseType = z.infer<typeof exerciseSchema>

export type ExerciseResultType = z.infer<typeof exerciseResultSchema>

export type ExerciseInputType = z.infer<typeof exerciseInputSchema>

export type InitialSetCountType = z.infer<typeof initialSetCountSchema>

export type RestTimerType = z.infer<typeof restTimerSchema>

export type TabataTimerType = z.infer<typeof tabataTimerSchema>

export type ChecklistSetType = z.infer<typeof checklistSetSchema>

export type CardioSetType = z.infer<typeof cardioSetSchema>

export type WeightSetType = z.infer<typeof weightSetSchema>

export type SidedWeightSetType = z.infer<typeof sidedWeightSetSchema>

export type ClimbingSetType = z.infer<typeof climbingSetSchema>

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
    exercises: ExerciseType[]
    examples: ExampleType[] // TODO: Remove
    exampleResults: ExampleResultType[] // TODO: Remove
}

//
// Frontend
//
export type SelectOption = {
    value: IdType
    label: string
    disable: boolean
}
