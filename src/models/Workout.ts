import { StatusEnum, TableEnum } from '@/shared/enums'
import type {
    IdType,
    StatusType,
    TextAreaType,
    TextLineType,
    TimestampType,
} from '@/shared/types/shared'
import type { ExerciseGroupType } from '@/shared/types/workout'
import type { WorkoutResultType } from '@/shared/types/workout-result'
import { createId } from '@/shared/utils'

interface WorkoutParams {
    id?: IdType
    createdAt?: TimestampType
    status?: StatusType[]
    name?: TextLineType
    desc?: TextAreaType
    lastChild?: WorkoutResultType
    warmupGroups?: ExerciseGroupType[]
    cooldownGroups?: ExerciseGroupType[]
    exerciseGroups?: ExerciseGroupType[]
    nextWorkoutIds?: IdType[]
}

/**
 * `Workout` parent model.
 *
 * Represents all relevant details of a workout session.
 */
export default class Workout {
    id: IdType
    createdAt: TimestampType
    status: StatusType[]
    name: TextLineType
    desc: TextAreaType
    lastChild?: WorkoutResultType
    warmupGroups: ExerciseGroupType[]
    cooldownGroups: ExerciseGroupType[]
    exerciseGroups: ExerciseGroupType[]
    nextWorkoutIds: IdType[]

    constructor(params: WorkoutParams) {
        this.id = params.id ?? createId(TableEnum.WORKOUTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.status = params.status ?? [StatusEnum.ENABLED]
        this.name = params.name ?? 'My Workout'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
        this.warmupGroups = params.warmupGroups ?? []
        this.cooldownGroups = params.cooldownGroups ?? []
        this.exerciseGroups = params.exerciseGroups ?? []
        this.nextWorkoutIds = params.nextWorkoutIds ?? []
    }
}
