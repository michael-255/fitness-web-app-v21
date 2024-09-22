import { TableEnum } from '@/shared/enums'
import type { IdType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

interface MeasurementParams {
    id?: IdType
    createdAt?: TimestampType
    note?: TextAreaType
    field: any // TODO: MeasurementFieldType // Required, not defaulted
    // Diet & Weight
    calories?: any // TODO: CaloriesType
    carbs?: any // TODO: CarbohydratesType
    fat?: any // TODO: FatType
    protein?: any // TODO: ProteinType
    weight?: any // TODO: WeightType
    bodyFat?: any // TODO: BodyFatType
    bodyMassIndex?: any // TODO: BodyMassIndexType // Would this be calculated as needed?
    // Health
    temperature?: any // TODO: TemperatureType
    bloodPressure?: any // TODO: BloodPressureType
    bloodOxygen?: any // TODO: BloodOxygenType
    // Body
    height?: any // TODO: HeightType
    neck?: any // TODO: NeckType
    shoulders?: any // TODO: ShouldersType
    chest?: any // TODO: ChestType
    waist?: any // TODO: WaistType
    leftBicep?: any // TODO: LeftBicepType
    rightBicep?: any // TODO: RightBicepType
    leftForearm?: any // TODO: LeftForearmType
    rightForearm?: any // TODO: RightForearmType
    leftThigh?: any // TODO: LeftThighType
    rightThigh?: any // TODO: RightThighType
    leftCalf?: any // TODO: LeftCalfType
    rightCalf?: any // TODO: RightCalfType
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
    field: any // TODO: MeasurementFieldType
    // Diet & Weight
    calories?: any // TODO: CaloriesType
    carbs?: any // TODO: CarbohydratesType
    fat?: any // TODO: FatType
    protein?: any // TODO: ProteinType
    weight?: any // TODO: WeightType
    bodyFat?: any // TODO: BodyFatType
    bodyMassIndex?: any // TODO: BodyMassIndexType // Would this be calculated as needed?
    // Health
    temperature?: any // TODO: TemperatureType
    bloodPressure?: any // TODO: BloodPressureType
    bloodOxygen?: any // TODO: BloodOxygenType
    // Body
    height?: any // TODO: HeightType
    neck?: any // TODO: NeckType
    shoulders?: any // TODO: ShouldersType
    chest?: any // TODO: ChestType
    waist?: any // TODO: WaistType
    leftBicep?: any // TODO: LeftBicepType
    rightBicep?: any // TODO: RightBicepType
    leftForearm?: any // TODO: LeftForearmType
    rightForearm?: any // TODO: RightForearmType
    leftThigh?: any // TODO: LeftThighType
    rightThigh?: any // TODO: RightThighType
    leftCalf?: any // TODO: LeftCalfType
    rightCalf?: any // TODO: RightCalfType

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
