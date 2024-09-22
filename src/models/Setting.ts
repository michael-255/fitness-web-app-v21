import type { SettingKeyType, SettingValueType } from '@/shared/types'

interface SettingParams {
    key: SettingKeyType
    value: SettingValueType
}

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
