import { TableEnum } from '@/shared/enums'
import type { IdType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

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
    catagory: any // TODO: MeasurementCatagoryType
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
    // TODO: Lab Work

    constructor({
        id,
        createdAt,
        note,
        catagory,
        field,
        calories,
        carbs,
        fat,
        protein,
        weight,
        bodyFat,
        bodyMassIndex,
        temperature,
        bloodPressure,
        bloodOxygen,
        height,
        neck,
        shoulders,
        chest,
        waist,
        leftBicep,
        rightBicep,
        leftForearm,
        rightForearm,
        leftThigh,
        rightThigh,
        leftCalf,
        rightCalf,
    }: {
        id?: IdType
        createdAt?: TimestampType
        note?: TextAreaType
        catagory?: any // TODO: MeasurementCatagoryType
        field?: any // TODO: MeasurementFieldType
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
    }) {
        this.id = id ?? createId(TableEnum.MEASUREMENTS)
        this.createdAt = createdAt ?? Date.now()
        this.note = note ?? ''
        this.catagory = catagory ?? '' // TODO
        this.field = field ?? '' // TODO
        this.calories = calories ?? undefined
        this.carbs = carbs ?? undefined
        this.fat = fat ?? undefined
        this.protein = protein ?? undefined
        this.weight = weight ?? undefined
        this.bodyFat = bodyFat ?? undefined
        this.bodyMassIndex = bodyMassIndex ?? undefined
        this.temperature = temperature ?? undefined
        this.bloodPressure = bloodPressure ?? undefined
        this.bloodOxygen = bloodOxygen ?? undefined
        this.height = height ?? undefined
        this.neck = neck ?? undefined
        this.shoulders = shoulders ?? undefined
        this.chest = chest ?? undefined
        this.waist = waist ?? undefined
        this.leftBicep = leftBicep ?? undefined
        this.rightBicep = rightBicep ?? undefined
        this.leftForearm = leftForearm ?? undefined
        this.rightForearm = rightForearm ?? undefined
        this.leftThigh = leftThigh ?? undefined
        this.rightThigh = rightThigh ?? undefined
        this.leftCalf = leftCalf ?? undefined
        this.rightCalf = rightCalf ?? undefined
    }
}
