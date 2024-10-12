<script setup lang="ts">
import FormListCreateExerciseResult from '@/components/dialogs/create/forms/FormListCreateExerciseResult.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import type { ExerciseResultType } from '@/models/ExerciseResult'
import { SettingKeyEnum } from '@/models/Setting'
import ExerciseResultService from '@/services/ExerciseResultService'
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
const exerciseResultService = ExerciseResultService()
const selectedStore = useSelectedStore()
const settingsStore = useSettingsStore()

onUnmounted(() => {
    selectedStore.$reset()
})

async function createExerciseResultSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.exerciseResult) as ExerciseResultType
    if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
        return await createSubmit(recordDeepCopy)
    } else {
        onConfirmDialog({
            title: 'Create Exercise Result',
            message: 'Are you sure you want to create this Exercise Result?',
            color: 'positive',
            icon: saveIcon,
            onOk: async () => {
                return await createSubmit(recordDeepCopy)
            },
        })
    }
}

async function createSubmit(record: ExerciseResultType) {
    try {
        $q.loading.show()
        await exerciseResultService.add(record)
        log.info('Exercise Result created', record)
    } catch (error) {
        log.error(`Error creating Exercise Result`, error as Error)
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
            <q-toolbar-title>Create Exercise Result</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="createExerciseResultSubmit"
                            @validation-error="selectedStore.isExerciseResultValid = false"
                            @validation-success="selectedStore.isExerciseResultValid = true"
                            class="q-mb-xl"
                        >
                            <FormListCreateExerciseResult />
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
