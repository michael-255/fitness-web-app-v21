import { TableEnum } from '@/shared/enums'
import { idSchema, statusListSchema, textAreaSchema, timestampSchema } from '@/shared/schemas'
import type { IdType, StatusType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import { z } from 'zod'

//
// Schemas
//

export const exerciseResultGroupSchema = z.object({
    exerciseResultIds: z.array(idSchema.optional()), // undefined = exercise skipped or missing
})

export const workoutResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    parentId: idSchema,
    note: textAreaSchema,
    finishedAt: timestampSchema.optional(),
    warmupResultGroups: z.array(exerciseResultGroupSchema),
    cooldownResultGroups: z.array(exerciseResultGroupSchema),
    exerciseResultGroups: z.array(exerciseResultGroupSchema),
})

//
// Types
//

export type ExerciseResultGroupType = z.infer<typeof exerciseResultGroupSchema>

export type WorkoutResultType = z.infer<typeof workoutResultSchema>

interface WorkoutResultParams {
    id?: IdType
    createdAt?: TimestampType
    status?: StatusType[]
    parentId: IdType // Parent reference required, never defaulted
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
    status: StatusType[]
    parentId: IdType
    note: TextAreaType
    finishedAt?: TimestampType
    warmupResultGroups: ExerciseResultGroupType[]
    cooldownResultGroups: ExerciseResultGroupType[]
    exerciseResultGroups: ExerciseResultGroupType[]

    constructor(params: WorkoutResultParams) {
        this.id = params.id ?? createId(TableEnum.WORKOUT_RESULTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.status = params.status ?? []
        this.parentId = params.parentId // Parent reference required, never defaulted
        this.note = params.note ?? ''
        this.finishedAt = params.finishedAt ?? undefined
        this.warmupResultGroups = params.warmupResultGroups ?? []
        this.cooldownResultGroups = params.cooldownResultGroups ?? []
        this.exerciseResultGroups = params.exerciseResultGroups ?? []
    }
}
