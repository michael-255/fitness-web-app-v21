import { timestampSchema } from '@/shared/schemas'
import type { TimestampType } from '@/shared/types'
import { z } from 'zod'

//
// Enums
//

export enum LogLevelEnum {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

//
// Schemas
//

export const logAutoIdSchema = z.number().int().optional()

export const logLevelSchema = z.nativeEnum(LogLevelEnum)

export const logLabelSchema = z.string().trim()

export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()

export const logSchema = z.object({
    autoId: logAutoIdSchema,
    createdAt: timestampSchema,
    logLevel: logLevelSchema,
    label: logLabelSchema,
    details: logDetailsSchema,
})

//
// Types
//

export type LogAutoIdType = z.infer<typeof logAutoIdSchema>
export type LogLevelType = z.infer<typeof logLevelSchema>
export type LogLabelType = z.infer<typeof logLabelSchema>
export type LogDetailsType = z.infer<typeof logDetailsSchema>

export type LogType = z.infer<typeof logSchema>

interface LogParams {
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType | Error
}

//
// Model
//

/**
 * Application `Log` model.
 *
 * This model is used for all internal logging. Logs can also be reviewed in app.
 */
export default class Log {
    autoId: LogAutoIdType // Handled by Dexie
    createdAt: TimestampType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor(params: LogParams) {
        this.createdAt = Date.now()
        this.logLevel = params.logLevel
        this.label = params.label

        if (params.details instanceof Error) {
            this.details = {
                name: params.details.name,
                message: params.details.message,
                stack: params.details.stack,
            }
        } else {
            this.details = params.details
        }
    }
}
