<script setup lang="ts">
import DialogInstructionsOverlay from '@/components/dialogs/DialogInstructionsOverlay.vue'
import useLogger from '@/composables/useLogger'
import LogService from '@/services/LogService'
import SettingService from '@/services/SettingService'
import { appDescription } from '@/shared/constants'
import { errorIcon } from '@/shared/icons'
import useSettingsStore from '@/stores/settings'
import { colors, useMeta, useQuasar } from 'quasar'
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'

/**
 * Do NOT overwrite these specific properties in another useMeta call.
 */
useMeta({
    meta: {
        description: { name: 'description', content: appDescription },
        charset: { charset: 'UTF-8' },
        viewport: {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
        },
        themeColor: { name: 'theme-color', content: `${colors.getPaletteColor('primary')}` },
        msTileColor: {
            name: 'msapplication-TileColor',
            content: `${colors.getPaletteColor('primary')}`,
        },
    },
    link: {
        manifest: {
            rel: 'manifest',
            href: `${import.meta.env.BASE_URL}manifest.json`,
        },
        appleTouchIcon: {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: `${import.meta.env.BASE_URL}apple-touch-icon.png`,
        },
        favicon32: {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: `${import.meta.env.BASE_URL}favicon-32x32.png`,
        },
        favicon16: {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: `${import.meta.env.BASE_URL}favicon-16x16.png`,
        },
        maskIcon: {
            rel: 'mask-icon',
            href: `${import.meta.env.BASE_URL}safari-pinned-tab.svg`,
            color: `${colors.getPaletteColor('primary')}`,
        },
    },
    noscript: {
        default:
            'Your browser does not support JavaScript or has it disabled. Please enable JavaScript in your web browser settings or white-list our domain in your JavaScript blocker for the best experience.',
    },
})

const notify = useQuasar().notify
const { log } = useLogger()
const settingsStore = useSettingsStore()

// Loading live Settings into the store on startup for use throughout the app.
const subscription = SettingService.liveObservable().subscribe({
    next: (records) => (settingsStore.settings = records),
    error: (error) => log.error(`Error loading live Settings`, error as Error),
})

onMounted(async () => {
    try {
        const settings = await SettingService.initialize()
        log.silentDebug('Settings initialized', settings)
    } catch (error) {
        // Output the error and notify user since it could be a database or logger failure
        notify({ message: 'Error initializing settings', icon: errorIcon, color: 'negative' })
        console.error(error)
    }

    try {
        const logsPurged = await LogService.purge()
        log.silentDebug('Expired logs purged', { logsPurged })
    } catch (error) {
        log.error('Error purging expired logs', error as Error)
    }
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <DialogInstructionsOverlay />
    <RouterView />
</template>
