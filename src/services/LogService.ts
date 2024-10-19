import { logSchema, type LogAutoIdType, type LogType } from '@/models/Log'
import { SettingKeyEnum } from '@/models/Setting'
import DB, { Database } from '@/services/db'
import { DurationEnum, DurationMSEnum, TableEnum } from '@/shared/enums'
import { logsTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Log model.
 */
export class LogService extends BaseService {
    private static _instance: LogService | null = null

    private constructor(public db: Database) {
        super()
    }

    static getSingleton(db: Database = DB): LogService {
        if (!LogService._instance) {
            LogService._instance = new LogService(db)
        }
        return LogService._instance
    }

    labelSingular = 'Log'
    labelPlural = 'Logs'
    modelSchema = logSchema
    table = TableEnum.LOGS
    tableColumns = [
        hiddenTableColumn('autoId'),
        tableColumn('autoId', 'Auto Id'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('logLevel', 'Log Level'),
        tableColumn('label', 'Label', 'TEXT'),
        tableColumn('details', 'Details', 'JSON'),
    ]
    displayIcon = logsTableIcon
    tableIcon = logsTableIcon
    supportsTableColumnFilters = true
    supportsTableCharts = true
    supportsCharts = false
    supportsInspect = true
    supportsCreate = false
    supportsEdit = false
    supportsDelete = false
    chartsDialogProps = null! // TODO
    inspectDialogProps = null! // TODO
    createDialogProps = null! // TODO
    editDialogProps = null! // TODO
    deleteDialogProps = null! // TODO

    /**
     * Purges logs based on the log retention duration setting. Returns the number of logs purged.
     */
    async purge() {
        const logRetentionDuration = (
            await this.db.table(TableEnum.SETTINGS).get(SettingKeyEnum.LOG_RETENTION_DURATION)
        )?.value as DurationEnum

        if (!logRetentionDuration || logRetentionDuration === DurationEnum.Forever) {
            return 0 // No logs purged
        }

        const allLogs = await this.db.table(TableEnum.LOGS).toArray()
        const maxLogAgeMs = DurationMSEnum[logRetentionDuration]
        const now = Date.now()

        // Find Logs that are older than the retention time and map them to their keys
        const removableLogs = allLogs
            .filter((log: LogType) => {
                const logTimestamp = log.createdAt ?? 0
                const logAge = now - logTimestamp
                return logAge > maxLogAgeMs
            })
            .map((log: LogType) => log.autoId!) // Map remaining Log ids for removal

        await this.db.table(TableEnum.LOGS).bulkDelete(removableLogs)
        return removableLogs.length // Number of logs deleted
    }

    /**
     * Returns a Logs live query ordered by creation date.
     */
    liveObservable(): Observable<LogType[]> {
        return liveQuery(() =>
            this.db.table(TableEnum.LOGS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns a Log by Auto ID.
     */
    async get(autoId: LogAutoIdType): Promise<LogType> {
        const modelToGet = await this.db.table(TableEnum.LOGS).get(Number(autoId))
        if (!modelToGet) {
            throw new Error(`Log Auto Id not found: ${autoId}`)
        }
        return modelToGet!
    }

    /**
     * Creates a new Log in the database.
     */
    async add(log: LogType): Promise<LogType> {
        const validatedLog = logSchema.parse(log)
        await this.db.table(TableEnum.LOGS).add(validatedLog)
        return validatedLog
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default LogService.getSingleton()
