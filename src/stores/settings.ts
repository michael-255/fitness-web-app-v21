import { SettingKeyEnum, type SettingType } from '@/models/Setting'
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
        advancedMode: (state) => {
            return state.settings.find((s) => s.key === SettingKeyEnum.ADVANCED_MODE)?.value
        },
        consoleLogs: (state) => {
            return state.settings.find((s) => s.key === SettingKeyEnum.CONSOLE_LOGS)?.value
        },
        infoMessages: (state) => {
            return state.settings.find((s) => s.key === SettingKeyEnum.INFO_MESSAGES)?.value
        },
        instructionsOverlay: (state) => {
            return state.settings.find((s) => s.key === SettingKeyEnum.INSTRUCTIONS_OVERLAY)?.value
        },
        logRetentionDuration: (state) => {
            return state.settings.find((s) => s.key === SettingKeyEnum.LOG_RETENTION_DURATION)
                ?.value
        },
    },
})

export default useSettingsStore
