import { TableEnum } from '@/shared/enums'
import type {
    IdType,
    OptionalTimestampType,
    TagType,
    TextAreaType,
    TimestampType,
} from '@/shared/types'
import { createId } from '@/shared/utils'

interface WorkoutResultParams {
    id?: IdType
    createdAt?: TimestampType
    tags?: TagType[]
    workoutId: IdType // Parent reference required, never defaulted
    note?: TextAreaType
    finishedAt?: OptionalTimestampType
    warmupResultGroups?: any[] // TODO: ExerciseResultGroup[]
    exerciseResultGroups?: any[] // TODO: ExerciseResultGroup[]
    cooldownResultGroups?: any[] // TODO: ExerciseResultGroup[]
}

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

    constructor(params: WorkoutResultParams) {
        this.id = params.id ?? createId(TableEnum.WORKOUT_RESULTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.tags = params.tags ?? []
        this.workoutId = params.workoutId // Parent reference required, never defaulted
        this.note = params.note ?? ''
        this.finishedAt = params.finishedAt ?? undefined
        this.warmupResultGroups = params.warmupResultGroups ?? []
        this.exerciseResultGroups = params.exerciseResultGroups ?? []
        this.cooldownResultGroups = params.cooldownResultGroups ?? []
    }
}
