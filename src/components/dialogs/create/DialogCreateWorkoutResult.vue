<script setup lang="ts">
import FormListCreateWorkoutResult from '@/components/dialogs/create/forms/FormListCreateWorkoutResult.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import { SettingKeyEnum } from '@/models/Setting'
import type { WorkoutResultType } from '@/models/WorkoutResult'
import WorkoutResultService from '@/services/WorkoutResultService'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { onUnmounted } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const { onConfirmDialog } = useDialogs()
const workoutResultService = WorkoutResultService()
const selectedStore = useSelectedStore()
const settingsStore = useSettingsStore()

onUnmounted(() => {
    selectedStore.$reset()
})

async function createWorkoutResultSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.workoutResult) as WorkoutResultType
    if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
        return await createSubmit(recordDeepCopy)
    } else {
        onConfirmDialog({
            title: 'Create Workout Result',
            message: 'Are you sure you want to create this Workout Result?',
            color: 'positive',
            icon: saveIcon,
            onOk: async () => {
                return await createSubmit(recordDeepCopy)
            },
        })
    }
}

async function createSubmit(record: WorkoutResultType) {
    try {
        $q.loading.show()
        await workoutResultService.add(record)
        log.info('Workout Result created', record)
    } catch (error) {
        log.error(`Error creating Workout Result`, error as Error)
    } finally {
        $q.loading.hide()
        onDialogOK()
    }
}
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
            <q-icon :name="createIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Create Workout Result</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="createWorkoutResultSubmit"
                            @validation-error="selectedStore.isWorkoutResultValid = false"
                            @validation-success="selectedStore.isWorkoutResultValid = true"
                            class="q-mb-xl"
                        >
                            <FormListCreateWorkoutResult />
                        </q-form>
                        <div class="q-mt-xl" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.toolbar-height {
    max-height: 50px;
}
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
