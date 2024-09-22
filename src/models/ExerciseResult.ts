import { TableEnum } from '@/shared/enums'
import type { IdType, TagType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

interface ExerciseResultParams {
    id?: IdType
    createdAt?: TimestampType
    tags?: TagType[]
    exerciseId: IdType // Parent reference required, never defaulted
    note?: TextAreaType
    checklistSets?: any[] // TODO: ChecklistSet[]
    cardioSets?: any[] // TODO: CardioSet[]
    weightSets?: any[] // TODO: WeightSet[]
    sidedWeightSets?: any[] // TODO: SidedWeightSet[]
    climbingSession?: any[] // TODO: ClimbingSession[]
}

/**
 * `ExerciseResult` child model.
 *
 *  Represents the results of an exercise. This references the sets and their results.
 */
export default class ExerciseResult {
    id: IdType
    createdAt: TimestampType
    tags: TagType[]
    exerciseId: IdType
    note: TextAreaType
    checklistSets?: any[] // TODO: ChecklistSet[]
    cardioSets?: any[] // TODO: CardioSet[]
    weightSets?: any[] // TODO: WeightSet[]
    sidedWeightSets?: any[] // TODO: SidedWeightSet[]
    climbingSession?: any[] // TODO: ClimbingSession[]

    constructor(params: ExerciseResultParams) {
        this.id = params.id ?? createId(TableEnum.EXERCISE_RESULTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.tags = params.tags ?? []
        this.exerciseId = params.exerciseId // Parent reference required, never defaulted
        this.note = params.note ?? ''
        this.checklistSets = params.checklistSets ?? undefined
        this.cardioSets = params.cardioSets ?? undefined
        this.weightSets = params.weightSets ?? undefined
        this.sidedWeightSets = params.sidedWeightSets ?? undefined
        this.climbingSession = params.climbingSession ?? undefined
    }
}
