<script setup lang="ts">
import FormListEditExample from '@/components/dialogs/edit/forms/FormListEditExample.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExamplesService from '@/services/ExamplesService'
import { SettingKeyEnum } from '@/shared/enums'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import type { ExampleType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { onUnmounted } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const { onConfirmDialog } = useDialogs()
const examplesService = ExamplesService()
const selectedStore = useSelectedStore()
const settingsStore = useSettingsStore()

onUnmounted(() => {
    selectedStore.$reset()
})

async function updateExampleSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.example) as ExampleType
    if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
        return await updateSubmit(recordDeepCopy)
    } else {
        onConfirmDialog({
            title: 'Update Example',
            message: 'Are you sure you want to update this Example?',
            color: 'positive',
            icon: saveIcon,
            onOk: async () => {
                return await updateSubmit(recordDeepCopy)
            },
        })
    }
}

async function updateSubmit(record: ExampleType) {
    try {
        $q.loading.show()
        await examplesService.put(record)
        log.info('Example updated', record)
    } catch (error) {
        log.error(`Error updating Example`, error as Error)
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
            <q-toolbar-title>Edit Example</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="updateExampleSubmit"
                            @validation-error="selectedStore.isExampleValid = false"
                            @validation-success="selectedStore.isExampleValid = true"
                            class="q-mb-xl"
                        >
                            <FormListEditExample />
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
