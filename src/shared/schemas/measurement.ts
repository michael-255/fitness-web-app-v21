import { z } from 'zod'
import { MeasurementFieldEnum } from '../enums'
import { idSchema, textAreaSchema, timestampSchema } from './shared'

//
// Fields
//
export const measurementFieldSchema = z.nativeEnum(MeasurementFieldEnum)

export const caloriesSchema = z.any() // TODO

export const nutritionSchema = z.any() // TODO

export const bodyWeightSchema = z.any() // TODO

export const percentSchema = z.any() // TODO

export const bodyMassIndexSchema = z.any() // TODO

export const temperatureSchema = z.any() // TODO

export const bloodPressureSchema = z.any() // TODO

export const bodyMeasurementSchema = z.any() // TODO

//
// Model
//
export const measurementSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    note: textAreaSchema,
    field: measurementFieldSchema,
    // Diet & Weight
    calories: caloriesSchema.optional(),
    carbs: nutritionSchema.optional(),
    fat: nutritionSchema.optional(),
    protein: nutritionSchema.optional(),
    weight: bodyWeightSchema.optional(),
    bodyFat: percentSchema.optional(),
    bodyMassIndex: bodyMassIndexSchema.optional(), // TODO: Should this value just be computed?
    // Health
    temperature: temperatureSchema.optional(),
    bloodPressure: bloodPressureSchema.optional(),
    bloodOxygen: percentSchema.optional(),
    // Body
    height: bodyMeasurementSchema.optional(),
    neck: bodyMeasurementSchema.optional(),
    shoulders: bodyMeasurementSchema.optional(),
    chest: bodyMeasurementSchema.optional(),
    waist: bodyMeasurementSchema.optional(),
    leftBicep: bodyMeasurementSchema.optional(), // TODO: Combine to { left, right }?
    rightBicep: bodyMeasurementSchema.optional(),
    leftForearm: bodyMeasurementSchema.optional(),
    rightForearm: bodyMeasurementSchema.optional(),
    leftThigh: bodyMeasurementSchema.optional(),
    rightThigh: bodyMeasurementSchema.optional(),
    leftCalf: bodyMeasurementSchema.optional(),
    rightCalf: bodyMeasurementSchema.optional(),
})
