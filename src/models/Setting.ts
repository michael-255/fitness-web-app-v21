import { z } from 'zod'

//
// Enums
//

/**
 * The only valid keys for settings in the application.
 */
export enum SettingKeyEnum {
    ADVANCED_MODE = 'advanced-mode',
    INSTRUCTIONS_OVERLAY = 'instructions-overlay',
    CONSOLE_LOGS = 'console-logs',
    INFO_MESSAGES = 'info-messages',
    LOG_RETENTION_DURATION = 'log-retention-duration',
}

//
// Schemas
//

export const settingKeySchema = z.nativeEnum(SettingKeyEnum)

export const settingValueSchema = z
    .union([z.boolean(), z.number(), z.string(), z.null()])
    .optional()

export const settingSchema = z.object({
    key: settingKeySchema,
    value: settingValueSchema,
})

//
// Types
//

export type SettingKeyType = z.infer<typeof settingKeySchema>
export type SettingValueType = z.infer<typeof settingValueSchema>

export type SettingType = z.infer<typeof settingSchema>

interface SettingParams {
    key: SettingKeyType
    value: SettingValueType
}

//
// Model
//

/**
 * Application `Setting` model.
 *
 * This model is used for app wide settings. They are initialized and live queried during startup
 * in `App.vue` and stored in the `SettingsStore` for easy access.
 */
export default class Setting {
    key: SettingKeyType
    value: SettingValueType

    constructor(params: SettingParams) {
        this.key = params.key
        this.value = params.value
    }
}
