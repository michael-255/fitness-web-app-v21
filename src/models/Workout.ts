import { TableEnum, TagEnum } from '@/shared/enums'
import type { IdType, NameType, TagType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

/**
 * `Workout` parent model.
 *
 * Represents all relevant details of a workout session.
 */
export default class Workout {
    id: IdType
    createdAt: TimestampType
    tags: TagType[]
    name: NameType
    desc: TextAreaType
    lastChild?: any // TODO: WorkoutResultType
    warmupExerciseGroups: any[] // TODO: ExerciseGroupType[]
    cooldownExerciseGroups: any[] // TODO: ExerciseGroupType[]
    standardExerciseGroups: any[] // TODO: ExerciseGroupType[]
    nextWorkoutIds: IdType[]

    constructor({
        id,
        createdAt,
        tags,
        name,
        desc,
        lastChild,
        warmupExerciseGroups,
        cooldownExerciseGroups,
        standardExerciseGroups,
        nextWorkoutIds,
    }: {
        id?: IdType
        createdAt?: TimestampType
        tags?: TagType[]
        name?: NameType
        desc?: TextAreaType
        lastChild?: any // TODO: WorkoutResultType
        warmupExerciseGroups?: any[] // TODO: ExerciseGroupType[]
        cooldownExerciseGroups?: any[] // TODO: ExerciseGroupType[]
        standardExerciseGroups?: any[] // TODO: ExerciseGroupType[]
        nextWorkoutIds?: IdType[]
    }) {
        this.id = id ?? createId(TableEnum.WORKOUTS)
        this.createdAt = createdAt ?? Date.now()
        this.tags = tags ?? [TagEnum.ENABLED]
        this.name = name ?? 'My Workout'
        this.desc = desc ?? ''
        this.lastChild = lastChild ?? undefined
        this.warmupExerciseGroups = warmupExerciseGroups ?? []
        this.cooldownExerciseGroups = cooldownExerciseGroups ?? []
        this.standardExerciseGroups = standardExerciseGroups ?? []
        this.nextWorkoutIds = nextWorkoutIds ?? []
    }
}
