import { TableEnum } from '@/shared/enums'
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
    BODY_MASS_INDEX = 'Body Mass Index', // Based on if you have a Height measurement
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
    LEFT_BICEP = 'Left Bicep',
    RIGHT_BICEP = 'Right Bicep',
    LEFT_FOREARM = 'Left Forearm',
    RIGHT_FOREARM = 'Right Forearm',
    LEFT_THIGH = 'Left Thigh',
    RIGHT_THIGH = 'Right Thigh',
    LEFT_CALF = 'Left Calf',
    RIGHT_CALF = 'Right Calf',
    // Lab Work
    // ...
}

//
// Schemas
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

//
// Types
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
    bodyMassIndex?: BodyMassIndexType // Would this be calculated as needed?
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
    leftBicep?: BodyMeasurementType
    rightBicep?: BodyMeasurementType
    leftForearm?: BodyMeasurementType
    rightForearm?: BodyMeasurementType
    leftThigh?: BodyMeasurementType
    rightThigh?: BodyMeasurementType
    leftCalf?: BodyMeasurementType
    rightCalf?: BodyMeasurementType
    // TODO: Lab Work
    // ...
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
    bodyMassIndex?: BodyMassIndexType // Would this be calculated as needed?
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
    leftBicep?: BodyMeasurementType
    rightBicep?: BodyMeasurementType
    leftForearm?: BodyMeasurementType
    rightForearm?: BodyMeasurementType
    leftThigh?: BodyMeasurementType
    rightThigh?: BodyMeasurementType
    leftCalf?: BodyMeasurementType
    rightCalf?: BodyMeasurementType

    constructor(params: MeasurementParams) {
        this.id = params.id ?? createId(TableEnum.MEASUREMENTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.note = params.note ?? ''
        this.field = params.field // Required, not defaulted
        this.calories = params.calories ?? undefined
        this.carbs = params.carbs ?? undefined
        this.fat = params.fat ?? undefined
        this.protein = params.protein ?? undefined
        this.weight = params.weight ?? undefined
        this.bodyFat = params.bodyFat ?? undefined
        this.bodyMassIndex = params.bodyMassIndex ?? undefined
        this.temperature = params.temperature ?? undefined
        this.bloodPressure = params.bloodPressure ?? undefined
        this.bloodOxygen = params.bloodOxygen ?? undefined
        this.height = params.height ?? undefined
        this.neck = params.neck ?? undefined
        this.shoulders = params.shoulders ?? undefined
        this.chest = params.chest ?? undefined
        this.waist = params.waist ?? undefined
        this.leftBicep = params.leftBicep ?? undefined
        this.rightBicep = params.rightBicep ?? undefined
        this.leftForearm = params.leftForearm ?? undefined
        this.rightForearm = params.rightForearm ?? undefined
        this.leftThigh = params.leftThigh ?? undefined
        this.rightThigh = params.rightThigh ?? undefined
        this.leftCalf = params.leftCalf ?? undefined
        this.rightCalf = params.rightCalf ?? undefined
    }
}
