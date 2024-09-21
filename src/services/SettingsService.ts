import Setting from '@/models/Setting'
import DB, { Database } from '@/services/db'
import { DurationEnum, SettingKeyEnum, TableEnum } from '@/shared/enums'
import { settingSchema } from '@/shared/schemas'
import type { SettingKeyType, SettingType, SettingValueType } from '@/shared/types'
import { liveQuery, type Observable } from 'dexie'

export default function SettingsService(db: Database = DB) {
    /**
     * Initializes settings with default values if they do not exist in the database.
     */
    async function initialize(): Promise<SettingType[]> {
        const defaultSettings: {
            [key in SettingKeyEnum]: SettingValueType
        } = {
            [SettingKeyEnum.ADVANCED_MODE]: false,
            [SettingKeyEnum.INSTRUCTIONS_OVERLAY]: true,
            [SettingKeyEnum.CONSOLE_LOGS]: false,
            [SettingKeyEnum.INFO_MESSAGES]: true,
            [SettingKeyEnum.LOG_RETENTION_DURATION]: DurationEnum[DurationEnum['Six Months']],
        }

        const settingids = Object.values(SettingKeyEnum)

        const settings = await Promise.all(
            settingids.map(async (key) => {
                const setting = await db.table(TableEnum.SETTINGS).get(key)
                if (setting) {
                    return setting
                } else {
                    return new Setting({
                        key,
                        value: defaultSettings[key],
                    })
                }
            }),
        )

        await Promise.all(settings.map((setting) => db.table(TableEnum.SETTINGS).put(setting)))
        return settings
    }

    /**
     * Imports Settings into the database using put and returns a results object.
     */
    async function importData(settings: SettingType[]) {
        const validRecords: SettingType[] = []
        const invalidRecords: Partial<SettingType>[] = []

        // Validate each setting
        settings.forEach((record) => {
            if (settingSchema.safeParse(record).success) {
                validRecords.push(settingSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated settings into the database
        await Promise.all(validRecords.map((record) => db.table(TableEnum.SETTINGS).put(record)))

        // Return results object for FE handling
        return {
            validRecords,
            invalidRecords,
            importedCount: validRecords.length,
        }
    }

    /**
     * Custom clear operation for Settings that clears and resets them with defaults.
     */
    async function clear() {
        await db.table(TableEnum.SETTINGS).clear()
        await initialize()
    }

    /**
     * Returns a Settings live query with default ordering.
     */
    function liveObservable(): Observable<SettingType[]> {
        return liveQuery(() => db.table(TableEnum.SETTINGS).toArray())
    }

    /**
     * Returns a Setting by key.
     */
    async function get(settingKey: SettingKeyType): Promise<SettingType> {
        const modelToGet = await db.table(TableEnum.SETTINGS).get(settingKey)
        if (!modelToGet) {
            throw new Error(`Setting key not found: ${settingKey}`)
        }
        return modelToGet!
    }

    /**
     * Creates or overwrites a Setting in the database.
     */
    async function put(setting: SettingType): Promise<SettingType> {
        const validatedSetting = settingSchema.parse(setting)
        await db.table(TableEnum.SETTINGS).put(validatedSetting)
        return validatedSetting
    }

    return {
        initialize,
        importData,
        clear,
        liveObservable,
        get,
        put,
    }
}
