<script setup lang="ts">
import FormListEditExampleResult from '@/components/dialogs/edit/forms/FormListEditExampleResult.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResultsService from '@/services/ExampleResultsService'
import { SettingKeyEnum } from '@/shared/enums'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import type { ExampleResultType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { onUnmounted } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const { onConfirmDialog } = useDialogs()
const exampleResultsService = ExampleResultsService()
const selectedStore = useSelectedStore()
const settingsStore = useSettingsStore()

onUnmounted(() => {
    selectedStore.$reset()
})

async function updateExampleResultSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.exampleResult) as ExampleResultType
    if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
        return await updateSubmit(recordDeepCopy)
    } else {
        onConfirmDialog({
            title: 'Update Example Result',
            message: 'Are you sure you want to update this Example Result?',
            color: 'positive',
            icon: saveIcon,
            onOk: async () => {
                return await updateSubmit(recordDeepCopy)
            },
        })
    }
}

async function updateSubmit(record: ExampleResultType) {
    try {
        $q.loading.show()
        await exampleResultsService.put(record)
        log.info('Example updated', record)
    } catch (error) {
        log.error(`Error updating Example Result`, error as Error)
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
            <q-toolbar-title>Update Example Result</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="updateExampleResultSubmit"
                            @validation-error="selectedStore.isExampleResultValid = false"
                            @validation-success="selectedStore.isExampleResultValid = true"
                            class="q-mb-xl"
                        >
                            <FormListEditExampleResult />
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
