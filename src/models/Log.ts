import {
    type LogAutoIdType,
    type LogDetailsType,
    type LogLabelType,
    type LogLevelType,
    type TimestampType,
} from '@/shared/types'

/**
 * Application `Log` model.
 *
 * This model is used for all internal app logging. Logs can also be reviewed in app.
 */
export default class Log {
    autoId: LogAutoIdType // Handled by Dexie
    createdAt: TimestampType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor({
        logLevel,
        label,
        details,
    }: {
        logLevel: LogLevelType
        label: LogLabelType
        details: LogDetailsType
    }) {
        this.createdAt = Date.now()
        this.logLevel = logLevel
        this.label = label

        if (details instanceof Error) {
            this.details = {
                name: details.name,
                message: details.message,
                stack: details.stack,
            }
        } else {
            this.details = details
        }
    }
}
