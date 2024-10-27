import { TableEnum } from '@/shared/enums'
import { idSchema, timestampSchema } from '@/shared/schemas'
import type { IdType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
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

export const logLevelSchema = z.nativeEnum(LogLevelEnum)

export const logLabelSchema = z.string().trim()

export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()

export const logSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    logLevel: logLevelSchema,
    label: logLabelSchema,
    details: logDetailsSchema,
})

//
// Types
//

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
    id: IdType
    createdAt: TimestampType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor(params: LogParams) {
        this.id = createId(TableEnum.LOGS)
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
