import Setting, {
    SettingKeyEnum,
    settingSchema,
    type SettingKeyType,
    type SettingType,
    type SettingValueType,
} from '@/models/Setting'
import { DurationEnum, TableEnum } from '@/shared/enums'
import { settingsPageIcon, settingsTableIcon } from '@/shared/icons'
import { tableColumn } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import BaseService from './BaseService'

/**
 * Singleton class for managing most aspects of the Setting model.
 */
export class SettingService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Setting'
    labelPlural = 'Settings'
    modelSchema = settingSchema
    table = TableEnum.SETTINGS
    tableColumns = [tableColumn('key', 'Key'), tableColumn('value', 'Value')]
    displayIcon = settingsPageIcon
    tableIcon = settingsTableIcon
    supportsTableColumnFilters = false
    supportsTableCharts = false
    supportsCharts = false
    supportsInspect = false
    supportsCreate = false
    supportsEdit = false
    supportsDelete = false

    /**
     * Initializes settings with default values if they do not exist in the database.
     */
    async initialize(): Promise<SettingType[]>
    async initialize(): Promise<Record<string, any>[]>
    async initialize(): Promise<SettingType[] | Record<string, any>[]> {
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
                const setting = await this.db.table(TableEnum.SETTINGS).get(key)
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

        await Promise.all(settings.map((setting) => this.db.table(TableEnum.SETTINGS).put(setting)))
        return settings
    }

    /**
     * Imports Settings into the database using put and returns a results object.
     */
    async importData(records: SettingType[]) {
        const validRecords: SettingType[] = []
        const invalidRecords: Partial<SettingType>[] = []

        // Validate each setting
        records.forEach((record) => {
            if (settingSchema.safeParse(record).success) {
                validRecords.push(settingSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated records into the database
        await Promise.all(
            validRecords.map((record) => this.db.table(TableEnum.SETTINGS).put(record)),
        )

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
    async clear() {
        await this.db.table(TableEnum.SETTINGS).clear()
        await this.initialize()
    }

    /**
     * Returns a live query of records with default ordering.
     */
    liveTable(): Observable<SettingType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<SettingType[] | Record<string, any>[]> {
        return liveQuery(() => this.db.table(TableEnum.SETTINGS).toArray())
    }

    /**
     * Returns a Setting by key.
     */
    async get(settingKey: SettingKeyType): Promise<SettingType>
    async get(settingKey: SettingKeyType): Promise<Record<string, any>>
    async get(settingKey: SettingKeyType): Promise<SettingType | Record<string, any>> {
        const modelToGet = await this.db.table(TableEnum.SETTINGS).get(settingKey)
        if (!modelToGet) {
            throw new Error(`Setting key not found: ${settingKey}`)
        }
        return modelToGet!
    }

    /**
     * Creates or overwrites a Setting in the database.
     */
    async put(setting: SettingType): Promise<SettingType>
    async put(setting: SettingType): Promise<Record<string, any>>
    async put(setting: SettingType): Promise<SettingType | Record<string, any>> {
        const validatedSetting = settingSchema.parse(setting)
        await this.db.table(TableEnum.SETTINGS).put(validatedSetting)
        return validatedSetting
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default SettingService.instance()
