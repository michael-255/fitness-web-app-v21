import { TableEnum, TagEnum } from '@/shared/enums'
import type { IdType, TagType, TextAreaType, TextLineType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

interface WorkoutParams {
    id?: IdType
    createdAt?: TimestampType
    tags?: TagType[]
    name?: TextLineType
    desc?: TextAreaType
    lastChild?: any // TODO: WorkoutResultType
    warmupExerciseGroups?: any[] // TODO: ExerciseGroupType[]
    cooldownExerciseGroups?: any[] // TODO: ExerciseGroupType[]
    standardExerciseGroups?: any[] // TODO: ExerciseGroupType[]
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
    tags: TagType[]
    name: TextLineType
    desc: TextAreaType
    lastChild?: any // TODO: WorkoutResultType
    warmupExerciseGroups: any[] // TODO: ExerciseGroupType[]
    cooldownExerciseGroups: any[] // TODO: ExerciseGroupType[]
    standardExerciseGroups: any[] // TODO: ExerciseGroupType[]
    nextWorkoutIds: IdType[]

    constructor(params: WorkoutParams) {
        this.id = params.id ?? createId(TableEnum.WORKOUTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.tags = params.tags ?? [TagEnum.ENABLED]
        this.name = params.name ?? 'My Workout'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
        this.warmupExerciseGroups = params.warmupExerciseGroups ?? []
        this.cooldownExerciseGroups = params.cooldownExerciseGroups ?? []
        this.standardExerciseGroups = params.standardExerciseGroups ?? []
        this.nextWorkoutIds = params.nextWorkoutIds ?? []
    }
}
