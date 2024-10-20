<script setup lang="ts">
import FormListEditExercise from '@/components/dialogs/edit/forms/FormListEditExercise.vue'
import useLogger from '@/composables/useLogger'
import type { ExerciseType } from '@/models/Exercise'
import ExerciseService from '@/services/ExerciseService'
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

async function updateExerciseSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.exercise) as ExerciseType

    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Update Exercise',
            message: 'Are you sure you want to update this Exercise?',
            color: 'positive',
            icon: saveIcon,
            useConfirmationCode: 'NEVER',
        },
    }).onOk(async () => {
        try {
            $q.loading.show()
            await ExerciseService.put(recordDeepCopy)
            log.info('Exercise updated', recordDeepCopy)
        } catch (error) {
            log.error(`Error updating Exercise`, error as Error)
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
            <q-toolbar-title>Edit Exercise</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="updateExerciseSubmit"
                            @validation-error="selectedStore.isExerciseValid = false"
                            @validation-success="selectedStore.isExerciseValid = true"
                            class="q-mb-xl"
                        >
                            <FormListEditExercise />
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
