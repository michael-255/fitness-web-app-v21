<script setup lang="ts">
import { SettingKeyEnum } from '@/shared/enums'
import useSettingsStore from '@/stores/settings'

defineProps<{
    label: string
    description: string
}>()

const settingsStore = useSettingsStore()
</script>

<template>
    <q-item class="q-mb-md">
        <q-item-section>
            <q-item-label class="text-bold">{{ label }}</q-item-label>

            <q-item-label v-if="!settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)">
                {{ description }}
            </q-item-label>

            <slot />
        </q-item-section>
    </q-item>
</template>
