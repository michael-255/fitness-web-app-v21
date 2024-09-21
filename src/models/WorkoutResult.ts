import { TableEnum } from '@/shared/enums'
import type {
    IdType,
    OptionalTimestampType,
    TagType,
    TextAreaType,
    TimestampType,
} from '@/shared/types'
import { createId } from '@/shared/utils'

/**
 * `WorkoutResult` child model.
 *
 *  Represents the results of a workout session. This references the exercises and their results.
 */
export default class WorkoutResult {
    id: IdType
    createdAt: TimestampType
    tags: TagType[]
    workoutId: IdType
    note: TextAreaType
    finishedAt?: OptionalTimestampType
    warmupResultGroups: any[] // TODO: ExerciseResultGroup[]
    exerciseResultGroups: any[] // TODO: ExerciseResultGroup[]
    cooldownResultGroups: any[] // TODO: ExerciseResultGroup[]

    constructor({
        id,
        createdAt,
        tags,
        workoutId,
        note,
        finishedAt,
        warmupResultGroups,
        exerciseResultGroups,
        cooldownResultGroups,
    }: {
        id?: IdType
        createdAt?: TimestampType
        tags?: TagType[]
        workoutId: IdType // Required
        note?: TextAreaType
        finishedAt?: OptionalTimestampType
        warmupResultGroups?: any[] // TODO: ExerciseResultGroup[]
        exerciseResultGroups?: any[] // TODO: ExerciseResultGroup[]
        cooldownResultGroups?: any[] // TODO: ExerciseResultGroup[]
    }) {
        this.id = id ?? createId(TableEnum.WORKOUT_RESULTS)
        this.createdAt = createdAt ?? Date.now()
        this.tags = tags ?? []
        this.workoutId = workoutId
        this.note = note ?? ''
        this.finishedAt = finishedAt ?? undefined
        this.warmupResultGroups = warmupResultGroups ?? []
        this.exerciseResultGroups = exerciseResultGroups ?? []
        this.cooldownResultGroups = cooldownResultGroups ?? []
    }
}
