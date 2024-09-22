import { TableEnum } from '@/shared/enums'
import type {
    BloodPressureType,
    BodyMassIndexType,
    BodyMeasurementType,
    BodyWeightType,
    CaloriesType,
    IdType,
    MeasurementFieldType,
    NutritionType,
    PercentType,
    TemperatureType,
    TextAreaType,
    TimestampType,
} from '@/shared/types'
import { createId } from '@/shared/utils'

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
