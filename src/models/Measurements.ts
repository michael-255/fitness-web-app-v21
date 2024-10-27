import { LimitEnum, TableEnum } from '@/shared/enums'
import { idSchema, textAreaSchema, timestampSchema } from '@/shared/schemas'
import type { IdType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import { z } from 'zod'

//
// Enums
//

export enum MeasurementFieldEnum {
    // Diet & Weight
    CALORIES = 'Calories',
    CARBOHYDRATES = 'Carbohydrates',
    FAT = 'Fat',
    PROTEIN = 'Protein',
    WEIGHT = 'Weight',
    BODY_FAT = 'Body Fat',
    // Health
    TEMPERATURE = 'Temperature',
    BLOOD_PRESSURE = 'Blood Pressure', // Systolic/Diastolic
    BLOOD_OXYGEN = 'Blood Oxygen',
    // Body
    HEIGHT = 'Height', // Needed for BMI
    NECK = 'Neck',
    SHOULDERS = 'Shoulders',
    CHEST = 'Chest',
    WAIST = 'Waist',
    HIPS = 'Hips',
    LEFT_BICEP = 'Left Bicep',
    RIGHT_BICEP = 'Right Bicep',
    LEFT_FOREARM = 'Left Forearm',
    RIGHT_FOREARM = 'Right Forearm',
    LEFT_THIGH = 'Left Thigh',
    RIGHT_THIGH = 'Right Thigh',
    LEFT_CALF = 'Left Calf',
    RIGHT_CALF = 'Right Calf',
    // Lab Work
    CHOLESTEROL = 'Cholesterol', // mg/dL
    CHOLESTEROL_HDL = 'Cholesterol HDL', // mg/dL
    CHOLESTEROL_LDL = 'Cholesterol LDL', // mg/dL
    HEMOGLOBIN_A1C = 'Hemoglobin A1C', // Percent
}

//
// Schemas
//

export const measurementFieldSchema = z.nativeEnum(MeasurementFieldEnum)

export const caloriesSchema = z.number().int().min(0).max(LimitEnum.MAX_CALORIES)

export const nutritionSchema = z.number().int().min(0).max(LimitEnum.MAX_NUTRITION)

export const bodyWeightSchema = z.number().positive().max(LimitEnum.MAX_BODY_WEIGHT)

export const cholesterolSchema = z.number().int().min(0).max(LimitEnum.MAX_CHOLESTEROL)

export const percentSchema = z.number().min(0).max(100)

export const temperatureSchema = z
    .number()
    .min(LimitEnum.MIN_TEMPERATURE)
    .max(LimitEnum.MAX_TEMPERATURE)

export const bloodPressureReadingSchema = z
    .number()
    .int()
    .min(LimitEnum.MIN_BLOOD_PRESSURE)
    .max(LimitEnum.MAX_BLOOD_PRESSURE)

export const bloodPressureSchema = z.object({
    systolic: bloodPressureReadingSchema,
    diastolic: bloodPressureReadingSchema,
})

export const bodyMeasurementSchema = z.number().min(0).max(LimitEnum.MAX_BODY_MEASUREMENT)

export const sidedBodyMeasurementSchema = z.object({
    left: bodyMeasurementSchema,
    right: bodyMeasurementSchema,
})

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
    hips: bodyMeasurementSchema.optional(),
    biceps: sidedBodyMeasurementSchema.optional(),
    forearms: sidedBodyMeasurementSchema.optional(),
    thighs: sidedBodyMeasurementSchema.optional(),
    calfs: sidedBodyMeasurementSchema.optional(),
    // Lab Work
    cholesterol: cholesterolSchema.optional(),
    cholesterolHDL: cholesterolSchema.optional(),
    cholesterolLDL: cholesterolSchema.optional(),
    hemoglobinA1C: percentSchema.optional(),
})

//
// Types
//

export type MeasurementFieldType = z.infer<typeof measurementFieldSchema>

export type CaloriesType = z.infer<typeof caloriesSchema>

export type NutritionType = z.infer<typeof nutritionSchema>

export type BodyWeightType = z.infer<typeof bodyWeightSchema>

export type CholesterolType = z.infer<typeof cholesterolSchema>

export type PercentType = z.infer<typeof percentSchema>

export type TemperatureType = z.infer<typeof temperatureSchema>

export type BloodPressureReadingType = z.infer<typeof bloodPressureReadingSchema>

export type BloodPressureType = z.infer<typeof bloodPressureSchema>

export type BodyMeasurementType = z.infer<typeof bodyMeasurementSchema>

export type SidedBodyMeasurementType = z.infer<typeof sidedBodyMeasurementSchema>

export type MeasurementType = z.infer<typeof measurementSchema>

interface MeasurementParams {
    id?: IdType
    createdAt?: TimestampType
    note?: TextAreaType
    field: MeasurementFieldType // Required, not defaulted
    // Diet & Weight
    calories?: CaloriesType
    carbs?: NutritionType
    fat?: NutritionType
    protein?: NutritionType
    weight?: BodyWeightType
    bodyFat?: PercentType
    // Health
    temperature?: TemperatureType
    bloodPressure?: BloodPressureType
    bloodOxygen?: PercentType
    // Body
    height?: BodyMeasurementType
    neck?: BodyMeasurementType
    shoulders?: BodyMeasurementType
    chest?: BodyMeasurementType
    waist?: BodyMeasurementType
    hips?: BodyMeasurementType
    biceps?: SidedBodyMeasurementType
    forearms?: SidedBodyMeasurementType
    thighs?: SidedBodyMeasurementType
    calfs?: SidedBodyMeasurementType
    // Lab Work
    cholesterol?: CholesterolType
    cholesterolHDL?: CholesterolType
    cholesterolLDL?: CholesterolType
    hemoglobinA1C?: PercentType
}

/**
 * `Measurement` standalone model.
 *
 *  Represents the measurements used by the measurement modules. At least one of the measurement
 *  recording fields is expected to be present on the record.
 */
export default class Measurement {
    id: IdType
    createdAt: TimestampType
    note: TextAreaType
    field: MeasurementFieldType
    // Diet & Weight
    calories?: CaloriesType
    carbs?: NutritionType
    fat?: NutritionType
    protein?: NutritionType
    weight?: BodyWeightType
    bodyFat?: PercentType
    // Health
    temperature?: TemperatureType
    bloodPressure?: BloodPressureType
    bloodOxygen?: PercentType
    // Body
    height?: BodyMeasurementType
    neck?: BodyMeasurementType
    shoulders?: BodyMeasurementType
    chest?: BodyMeasurementType
    waist?: BodyMeasurementType
    hips?: BodyMeasurementType
    biceps?: SidedBodyMeasurementType
    forearms?: SidedBodyMeasurementType
    thighs?: SidedBodyMeasurementType
    calfs?: SidedBodyMeasurementType
    // Lab Work
    cholesterol?: CholesterolType
    cholesterolHDL?: CholesterolType
    cholesterolLDL?: CholesterolType
    hemoglobinA1C?: PercentType

    constructor(params: MeasurementParams) {
        this.id = params.id ?? createId(TableEnum.MEASUREMENTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.note = params.note ?? ''
        this.field = params.field // Required, not defaulted
        // Diet & Weight
        this.calories = params.calories ?? undefined
        this.carbs = params.carbs ?? undefined
        this.fat = params.fat ?? undefined
        this.protein = params.protein ?? undefined
        this.weight = params.weight ?? undefined
        this.bodyFat = params.bodyFat ?? undefined
        // Health
        this.temperature = params.temperature ?? undefined
        this.bloodPressure = params.bloodPressure ?? undefined
        this.bloodOxygen = params.bloodOxygen ?? undefined
        // Body
        this.height = params.height ?? undefined
        this.neck = params.neck ?? undefined
        this.shoulders = params.shoulders ?? undefined
        this.chest = params.chest ?? undefined
        this.waist = params.waist ?? undefined
        this.hips = params.hips ?? undefined
        this.biceps = params.biceps ?? undefined
        this.forearms = params.forearms ?? undefined
        this.thighs = params.thighs ?? undefined
        this.calfs = params.calfs ?? undefined
        // Lab Work
        this.cholesterol = params.cholesterol ?? undefined
        this.cholesterolHDL = params.cholesterolHDL ?? undefined
        this.cholesterolLDL = params.cholesterolLDL ?? undefined
        this.hemoglobinA1C = params.hemoglobinA1C ?? undefined
    }
}
