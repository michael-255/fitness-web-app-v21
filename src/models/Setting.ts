import type { SettingKeyType, SettingValueType } from '@/shared/types'

/**
 * Application `Setting` model.
 *
 * This model is used for app wide settings. They are initialized and live queried during startup
 * in `App.vue` and stored in the `SettingsStore` for easy access.
 */
export default class Setting {
    key: SettingKeyType
    value: SettingValueType

    constructor({ key, value }: { key: SettingKeyType; value: SettingValueType }) {
        this.key = key
        this.value = value
    }
}
