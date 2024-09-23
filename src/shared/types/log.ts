import { z } from 'zod'
import type {
    logAutoIdSchema,
    logDetailsSchema,
    logLabelSchema,
    logLevelSchema,
    logSchema,
} from '../schemas/log'

//
// Fields
//
export type LogAutoIdType = z.infer<typeof logAutoIdSchema>

export type LogLevelType = z.infer<typeof logLevelSchema>

export type LogLabelType = z.infer<typeof logLabelSchema>

export type LogDetailsType = z.infer<typeof logDetailsSchema>

//
// Model
//
export type LogType = z.infer<typeof logSchema>
