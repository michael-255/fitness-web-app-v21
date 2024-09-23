import { FlagEnum, TableEnum } from '@/shared/enums'
import type {
    ExerciseInputType,
    InitialSetCountType,
    RestTimerType,
    TabataTimerType,
} from '@/shared/types/exercise'
import type { ExerciseResultType } from '@/shared/types/exercise-result'
import type {
    FlagType,
    IdType,
    TextAreaType,
    TextLineType,
    TimestampType,
} from '@/shared/types/shared'
import { createId } from '@/shared/utils'

interface ExerciseParams {
    id?: IdType
    createdAt?: TimestampType
    flags?: FlagType[]
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
    flags: FlagType[]
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
        this.flags = params.flags ?? [FlagEnum.ENABLED]
        this.name = params.name ?? 'My Exercise'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
        this.inputs = params.inputs // Required, not defaulted
        this.initialSetCount = params.initialSetCount ?? 1
        this.restTimer = params.restTimer ?? undefined
        this.tabataTimer = params.tabataTimer ?? undefined
    }
}
