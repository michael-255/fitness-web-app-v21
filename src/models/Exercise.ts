import { TableEnum, TagEnum } from '@/shared/enums'
import type { IdType, TagType, TextAreaType, TextLineType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

interface ExerciseParams {
    id?: IdType
    createdAt?: TimestampType
    tags?: TagType[]
    name?: TextLineType
    desc?: TextAreaType
    lastChild?: any // TODO: ExerciseResultType
    initialSetCount?: any // TODO: InitialSetCountType
    inputs: any // TODO: ExerciseInputType // Required
    restTimer?: any // TODO: RestTimerType
    tabataTimer?: any // TODO: TabataTimerType
}

/**
 * `Exercise` parent model.
 *
 *  Represents all relevant details of an exercise.
 */
export default class Exercise {
    id: IdType
    createdAt: TimestampType
    tags: TagType[]
    name: TextLineType
    desc: TextAreaType
    lastChild?: any // TODO: ExerciseResultType
    initialSetCount?: any // TODO: InitialSetCountType
    inputs: any // TODO: ExerciseInputType
    restTimer?: any // TODO: RestTimerType
    tabataTimer?: any // TODO: TabataTimerType

    constructor(params: ExerciseParams) {
        this.id = params.id ?? createId(TableEnum.EXERCISES)
        this.createdAt = params.createdAt ?? Date.now()
        this.tags = params.tags ?? [TagEnum.ENABLED]
        this.name = params.name ?? 'My Exercise'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
        this.initialSetCount = params.initialSetCount ?? undefined
        this.inputs = params.inputs // Required, not defaulted
        this.restTimer = params.restTimer ?? undefined
        this.tabataTimer = params.tabataTimer ?? undefined
    }
}
