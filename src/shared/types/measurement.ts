import type { z } from 'zod'
import type {
    bloodPressureSchema,
    bodyMassIndexSchema,
    bodyMeasurementSchema,
    bodyWeightSchema,
    caloriesSchema,
    measurementFieldSchema,
    measurementSchema,
    nutritionSchema,
    percentSchema,
    temperatureSchema,
} from '../schemas/measurement'

//
// Fields
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
// Model
//
export type MeasurementType = z.infer<typeof measurementSchema>
