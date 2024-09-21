import { TableEnum, TagEnum } from '@/shared/enums'
import type { IdType, NameType, TagType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

interface ExerciseParams {
    id?: IdType
    createdAt?: TimestampType
    tags?: TagType[]
    name?: NameType
    desc?: TextAreaType
    lastChild?: any // TODO: ExerciseResultType
    initialSetCount?: any // TODO: InitialSetCountType
    inputs?: any // TODO: ExerciseInputType
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
    name: NameType
    desc: TextAreaType
    lastChild?: any // TODO: ExerciseResultType
    initialSetCount: any // TODO: InitialSetCountType
    inputs: any // TODO: ExerciseInputType
    restTimer?: any // TODO: RestTimerType
    tabataTimer?: any // TODO: TabataTimerType

    constructor(params: ExerciseParams = {}) {
        this.id = params.id ?? createId(TableEnum.EXERCISES)
        this.createdAt = params.createdAt ?? Date.now()
        this.tags = params.tags ?? [TagEnum.ENABLED]
        this.name = params.name ?? 'My Exercise'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
        this.initialSetCount = params.initialSetCount ?? 1 // TODO
        this.inputs = params.inputs ?? {} // TODO
        this.restTimer = params.restTimer ?? undefined // TODO
        this.tabataTimer = params.tabataTimer ?? undefined // TODO
    }
}
