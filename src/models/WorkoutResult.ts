import { TableEnum } from '@/shared/enums'
import type { FlagType, IdType, TextAreaType, TimestampType } from '@/shared/types/shared'
import type { ExerciseResultGroupType } from '@/shared/types/workout-result'
import { createId } from '@/shared/utils'

interface WorkoutResultParams {
    id?: IdType
    createdAt?: TimestampType
    flags?: FlagType[]
    workoutId: IdType // Parent reference required, never defaulted
    note?: TextAreaType
    finishedAt?: TimestampType
    warmupResultGroups?: ExerciseResultGroupType[]
    cooldownResultGroups?: ExerciseResultGroupType[]
    exerciseResultGroups?: ExerciseResultGroupType[]
}

/**
 * `WorkoutResult` child model.
 *
 *  Represents the results of a workout session. This references the exercises and their results.
 */
export default class WorkoutResult {
    id: IdType
    createdAt: TimestampType
    flags: FlagType[]
    workoutId: IdType
    note: TextAreaType
    finishedAt?: TimestampType
    warmupResultGroups: ExerciseResultGroupType[]
    cooldownResultGroups: ExerciseResultGroupType[]
    exerciseResultGroups: ExerciseResultGroupType[]

    constructor(params: WorkoutResultParams) {
        this.id = params.id ?? createId(TableEnum.WORKOUT_RESULTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.flags = params.flags ?? []
        this.workoutId = params.workoutId // Parent reference required, never defaulted
        this.note = params.note ?? ''
        this.finishedAt = params.finishedAt ?? undefined
        this.warmupResultGroups = params.warmupResultGroups ?? []
        this.cooldownResultGroups = params.cooldownResultGroups ?? []
        this.exerciseResultGroups = params.exerciseResultGroups ?? []
    }
}
