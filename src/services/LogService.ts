import { logSchema, type LogAutoIdType, type LogType } from '@/models/Log'
import { SettingKeyEnum } from '@/models/Setting'
import { DurationEnum, DurationMSEnum, TableEnum } from '@/shared/enums'
import { logsTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Log model.
 */
export class LogService extends BaseService {
    public constructor() {
        super()
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
     * Returns a live query of records ordered by creation date.
     */
    liveTable(): Observable<LogType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<LogType[] | Record<string, any>[]> {
        return liveQuery(() =>
            this.db.table(TableEnum.LOGS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns a Log by Auto ID.
     */
    async get(autoId: LogAutoIdType): Promise<LogType>
    async get(autoId: LogAutoIdType): Promise<Record<string, any>>
    async get(autoId: LogAutoIdType): Promise<LogType | Record<string, any>> {
        const modelToGet = await this.db.table(TableEnum.LOGS).get(Number(autoId))
        if (!modelToGet) {
            throw new Error(`Log Auto Id not found: ${autoId}`)
        }
        return modelToGet!
    }

    /**
     * Creates a new Log in the database.
     */
    async add(log: LogType): Promise<LogType>
    async add(log: LogType): Promise<Record<string, any>>
    async add(log: LogType): Promise<LogType | Record<string, any>> {
        const validatedLog = logSchema.parse(log)
        await this.db.table(TableEnum.LOGS).add(validatedLog)
        return validatedLog
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default LogService.instance()
