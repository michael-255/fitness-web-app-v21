import type { SettingKeyType, SettingType } from '@/models/Setting'
import { defineStore } from 'pinia'

/**
 * Should be initialized on app startup in `App.vue`.
 */
const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        settings: [] as SettingType[],
    }),

    getters: {
        getKeyValue: (state) => (key: SettingKeyType) => {
            return state.settings.find((s) => s.key === key)?.value
        },
    },
})

export default useSettingsStore
