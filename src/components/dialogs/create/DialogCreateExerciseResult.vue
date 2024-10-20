<script setup lang="ts">
import FormListCreateExerciseResult from '@/components/dialogs/create/forms/FormListCreateExerciseResult.vue'
import useLogger from '@/composables/useLogger'
import type { ExerciseResultType } from '@/models/ExerciseResult'
import ExerciseResultService from '@/services/ExerciseResultService'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { onUnmounted } from 'vue'
import DialogConfirm from '../DialogConfirm.vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})

async function createExerciseResultSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.exerciseResult) as ExerciseResultType

    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Create Exercise Result',
            message: 'Are you sure you want to create this Exercise Result?',
            color: 'positive',
            icon: saveIcon,
            useConfirmationCode: 'NEVER',
        },
    }).onOk(async () => {
        try {
            $q.loading.show()
            await ExerciseResultService.add(recordDeepCopy)
            log.info('Exercise Result created', recordDeepCopy)
        } catch (error) {
            log.error(`Error creating Exercise Result`, error as Error)
        } finally {
            $q.loading.hide()
            onDialogOK()
        }
    })
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
