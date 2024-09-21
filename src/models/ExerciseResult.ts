import { TableEnum } from '@/shared/enums'
import type { IdType, TagType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

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

    constructor({
        id,
        createdAt,
        tags,
        exerciseId,
        note,
        checklistSets,
        cardioSets,
        weightSets,
        sidedWeightSets,
        climbingSession,
    }: {
        id?: IdType
        createdAt?: TimestampType
        tags?: TagType[]
        exerciseId: IdType // Required
        note?: TextAreaType
        checklistSets?: any[] // TODO: ChecklistSet[]
        cardioSets?: any[] // TODO: CardioSet[]
        weightSets?: any[] // TODO: WeightSet[]
        sidedWeightSets?: any[] // TODO: SidedWeightSet[]
        climbingSession?: any[] // TODO: ClimbingSession[]
    }) {
        this.id = id ?? createId(TableEnum.EXERCISE_RESULTS)
        this.createdAt = createdAt ?? Date.now()
        this.tags = tags ?? []
        this.exerciseId = exerciseId
        this.note = note ?? ''
        this.checklistSets = checklistSets ?? undefined
        this.cardioSets = cardioSets ?? undefined
        this.weightSets = weightSets ?? undefined
        this.sidedWeightSets = sidedWeightSets ?? undefined
        this.climbingSession = climbingSession ?? undefined
    }
}
