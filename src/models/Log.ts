import type { LogAutoIdType, LogDetailsType, LogLabelType, LogLevelType } from '@/shared/types/log'
import type { TimestampType } from '@/shared/types/shared'

interface LogParams {
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType | Error
}

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
