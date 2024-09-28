import { logSchema, type LogAutoIdType, type LogType } from '@/models/Log'
import { SettingKeyEnum } from '@/models/Setting'
import DB, { Database } from '@/services/db'
import { DurationEnum, DurationMSEnum, TableEnum } from '@/shared/enums'
import { liveQuery, type Observable } from 'dexie'

export default function LogService(db: Database = DB) {
    /**
     * Purges logs based on the log retention duration setting. Returns the number of logs purged.
     */
    async function purge() {
        const logRetentionDuration = (
            await db.table(TableEnum.SETTINGS).get(SettingKeyEnum.LOG_RETENTION_DURATION)
        )?.value as DurationEnum

        if (!logRetentionDuration || logRetentionDuration === DurationEnum.Forever) {
            return 0 // No logs purged
        }

        const allLogs = await db.table(TableEnum.LOGS).toArray()
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

        await db.table(TableEnum.LOGS).bulkDelete(removableLogs)
        return removableLogs.length // Number of logs deleted
    }

    /**
     * Returns a Logs live query ordered by creation date.
     */
    function liveObservable(): Observable<LogType[]> {
        return liveQuery(() => db.table(TableEnum.LOGS).orderBy('createdAt').reverse().toArray())
    }

    /**
     * Returns a Log by Auto ID.
     */
    async function get(autoId: LogAutoIdType): Promise<LogType> {
        const modelToGet = await db.table(TableEnum.LOGS).get(Number(autoId))
        if (!modelToGet) {
            throw new Error(`Log Auto Id not found: ${autoId}`)
        }
        return modelToGet!
    }

    /**
     * Creates a new Log in the database.
     */
    async function add(log: LogType): Promise<LogType> {
        const validatedLog = logSchema.parse(log)
        await db.table(TableEnum.LOGS).add(validatedLog)
        return validatedLog
    }

    return {
        purge,
        liveObservable,
        get,
        add,
    }
}
