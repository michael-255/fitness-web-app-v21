<script setup lang="ts">
import FormListCreateWorkout from '@/components/dialogs/create/forms/FormListCreateWorkout.vue'
import useLogger from '@/composables/useLogger'
import type { WorkoutType } from '@/models/Workout'
import WorkoutService from '@/services/WorkoutService'
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

async function createWorkoutSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.workout) as WorkoutType

    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Create Workout',
            message: 'Are you sure you want to create this Workout?',
            color: 'positive',
            icon: saveIcon,
            useConfirmationCode: 'NEVER',
        },
    }).onOk(async () => {
        try {
            $q.loading.show()
            await WorkoutService.add(recordDeepCopy)
            log.info('Workout created', recordDeepCopy)
        } catch (error) {
            log.error(`Error creating Workout`, error as Error)
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
            <q-toolbar-title>Create Workout</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="createWorkoutSubmit"
                            @validation-error="selectedStore.isWorkoutValid = false"
                            @validation-success="selectedStore.isWorkoutValid = true"
                            class="q-mb-xl"
                        >
                            <FormListCreateWorkout />
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
