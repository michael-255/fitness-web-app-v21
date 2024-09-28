import { TableEnum } from '@/shared/enums'
import {
    idSchema,
    statusListSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from '@/shared/schemas'
import type { IdType, StatusType, TextAreaType, TextLineType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import { z } from 'zod'
import { workoutResultSchema, type WorkoutResultType } from './WorkoutResult'

//
// Schemas
//

export const exerciseGroupSchema = z.object({
    exerciseIds: z.array(idSchema), // 2+ means it's a superset
})

export const workoutSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: workoutResultSchema.optional(),
    warmupGroups: z.array(exerciseGroupSchema),
    cooldownGroups: z.array(exerciseGroupSchema),
    exerciseGroups: z.array(exerciseGroupSchema),
    nextWorkoutIds: z.array(idSchema),
})

//
// Types
//

export type ExerciseGroupType = z.infer<typeof exerciseGroupSchema>

export type WorkoutType = z.infer<typeof workoutSchema>

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
        this.status = params.status ?? []
        this.name = params.name ?? 'My Workout'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
        this.warmupGroups = params.warmupGroups ?? []
        this.cooldownGroups = params.cooldownGroups ?? []
        this.exerciseGroups = params.exerciseGroups ?? []
        this.nextWorkoutIds = params.nextWorkoutIds ?? []
    }
}
