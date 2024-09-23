<script setup lang="ts">
import Setting from '@/models/Setting'
import SettingService from '@/services/SettingService'
import { appDescription, appName } from '@/shared/constants'
import { SettingKeyEnum } from '@/shared/enums'
import {
    databaseIcon,
    donatePageIcon,
    downIcon,
    examplesPageIcon,
    recommendIcon,
    settingsPageIcon,
} from '@/shared/icons'
import useSettingsStore from '@/stores/settings'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const settingService = SettingService()
const settingsStore = useSettingsStore()

const showWelcome: Ref<any> = ref(false)

async function onCloseWelcomeOverlay() {
    await settingService.put(
        new Setting({
            key: SettingKeyEnum.INSTRUCTIONS_OVERLAY,
            value: false,
        }),
    )
    showWelcome.value = false
}

async function goToDonate() {
    await onCloseWelcomeOverlay()
    router.push('/donate')
}
</script>

<template>
    <q-dialog
        :model-value="Boolean(settingsStore.getKeyValue(SettingKeyEnum.INSTRUCTIONS_OVERLAY))"
        @update:model-value="
            settingService.put({
                key: SettingKeyEnum.INSTRUCTIONS_OVERLAY,
                value: $event,
            })
        "
        persistent
    >
        <q-card flat square>
            <q-card-section>
                <p class="text-h6">Welcome to {{ appName }}</p>

                <p>{{ appDescription }}</p>

                <p>
                    Continue reading to learn more, or scroll to the bottom and click the
                    <strong>Get Started</strong> button to jump right in.
                </p>

                <p>
                    On most pages, you can see the header at the top for quick access to the
                    Dashboards and Settings.
                </p>

                <p>
                    <q-btn
                        :icon="examplesPageIcon"
                        label="Examples"
                        color="primary"
                        size="sm"
                        disable
                        no-caps
                        stack
                    />
                </p>

                <p>
                    On the Examples page, you can click the star icons to favorite or unfavorite
                    items. You can also click the vertical dot icon to access record options like
                    charts, inspect, edit, and delete.
                </p>

                <p>
                    <q-btn
                        :icon="settingsPageIcon"
                        label="Settings"
                        color="primary"
                        size="sm"
                        disable
                        no-caps
                        stack
                    />
                </p>

                <p>
                    On the Settings page, you can access app wide options, manage your data, and
                    more.
                </p>

                <p>
                    <q-btn :icon="downIcon" color="accent" size="md" disable round />
                </p>

                <p>
                    Clicking the purple context menu button will open additional options for the
                    current page. These typically include links to the data tables for the current
                    records, the option to create a record, and more.
                </p>

                <p>
                    <q-btn :icon="databaseIcon" color="warning" size="md" disable round />
                </p>

                <p>
                    Clicking the database button will open the database page where you can view and
                    manage your records on a data table like you might see in a spreadsheet.
                </p>

                <p>
                    Hope you find {{ appName }} useful. Please consider donating to help me continue
                    to create and maintain apps like this. Thank you!
                </p>

                <p>
                    <q-btn color="pink" label="Donate" :icon="donatePageIcon" @click="goToDonate" />
                </p>

                <p>Click the button below when you are ready to use the app!</p>

                <q-btn
                    no-caps
                    label="Get Started"
                    class="full-width"
                    size="lg"
                    color="positive"
                    :icon="recommendIcon"
                    @click="onCloseWelcomeOverlay"
                />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
