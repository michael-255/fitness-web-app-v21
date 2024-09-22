import { TableEnum, TagEnum } from '@/shared/enums'
import type {
    ExerciseInputType,
    ExerciseResultType,
    IdType,
    InitialSetCountType,
    RestTimerType,
    TabataTimerType,
    TagType,
    TextAreaType,
    TextLineType,
    TimestampType,
} from '@/shared/types'
import { createId } from '@/shared/utils'

interface ExerciseParams {
    id?: IdType
    createdAt?: TimestampType
    tags?: TagType[]
    name?: TextLineType
    desc?: TextAreaType
    lastChild?: ExerciseResultType
    inputs: ExerciseInputType // Required
    initialSetCount?: InitialSetCountType
    restTimer?: RestTimerType
    tabataTimer?: TabataTimerType
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
    lastChild?: ExerciseResultType
    inputs: ExerciseInputType
    initialSetCount: InitialSetCountType
    restTimer?: RestTimerType
    tabataTimer?: TabataTimerType

    constructor(params: ExerciseParams) {
        this.id = params.id ?? createId(TableEnum.EXERCISES)
        this.createdAt = params.createdAt ?? Date.now()
        this.tags = params.tags ?? [TagEnum.ENABLED]
        this.name = params.name ?? 'My Exercise'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
        this.inputs = params.inputs // Required, not defaulted
        this.initialSetCount = params.initialSetCount ?? 1
        this.restTimer = params.restTimer ?? undefined
        this.tabataTimer = params.tabataTimer ?? undefined
    }
}
