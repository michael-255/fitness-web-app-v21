<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import { closeIcon, editIcon, saveIcon } from '@/shared/icons'
import type { ComponentWithPropsType, IdType, ServiceType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import DialogConfirm from './DialogConfirm.vue'

/**
 * Dialog for editing a record.
 */
const props = defineProps<{
    id: IdType
    service: ServiceType
    formComponents: ComponentWithPropsType[]
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const selectedStore = useSelectedStore()

const isFormValid = ref(true)
const isDisabled = computed(() => $q.loading.isActive || selectedStore.lockedStatus)

onMounted(async () => {
    try {
        selectedStore.record = await props.service.get(props.id)
    } catch (error) {
        log.error('Error loading record', error as Error)
    }
})

onUnmounted(() => {
    selectedStore.$reset()
})

async function onSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.record) as Record<string, any>

    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: `Update ${props.service.labelSingular}`,
            message: `Are you sure you want to update this ${props.service.labelSingular}?`,
            color: 'positive',
            icon: saveIcon,
            useUnlock: 'NEVER',
        },
    }).onOk(async () => {
        try {
            $q.loading.show()
            await props.service.put(recordDeepCopy)
            log.info(`${props.service.labelSingular} updated`, recordDeepCopy)
        } catch (error) {
            log.error(`Error updating ${props.service.labelSingular}`, error as Error)
        } finally {
            $q.loading.hide()
            onDialogOK() // Close the dialog at this point
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
            <q-icon :name="editIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Edit {{ service.labelSingular }}</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="onSubmit"
                            @validation-error="isFormValid = false"
                            @validation-success="isFormValid = true"
                            class="q-mb-xl"
                        >
                            <q-list padding>
                                <component
                                    v-for="(formComponent, index) in props.formComponents"
                                    :key="index"
                                    :is="formComponent.component"
                                    v-bind="formComponent.props"
                                />

                                <q-item>
                                    <q-item-section>
                                        <q-item-label>
                                            <div class="row justify-center">
                                                <q-btn
                                                    :label="`Update ${service.labelSingular}`"
                                                    :icon="saveIcon"
                                                    :disable="isDisabled"
                                                    color="positive"
                                                    type="submit"
                                                />
                                            </div>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item v-show="!isFormValid">
                                    <q-item-section>
                                        <div class="row justify-center text-warning">
                                            Correct invalid form entries and try again
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </q-list>
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
