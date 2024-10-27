<script setup lang="ts">
import { chartsIcon, closeIcon } from '@/shared/icons'
import type { IdType, ServiceType } from '@/shared/types'
import { useDialogPluginComponent } from 'quasar'

defineProps<{
    id: IdType
    service: ServiceType
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
</script>

<template>
    <q-dialog
        ref="dialogRef"
        transition-show="slide-up"
        transition-hide="slide-down"
        maximized
        @hide="onDialogHide"
    >
        <q-toolbar class="bg-info text-white toolbar-height">
            <q-icon :name="chartsIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Workout Charts</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div>{{ service.labelSingular }} {{ id }}</div>
                <div class="q-mt-xl" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
