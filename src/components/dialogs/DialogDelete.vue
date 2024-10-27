<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import { deleteIcon, lockIcon, unlockIcon } from '@/shared/icons'
import type { IdType, ServiceType } from '@/shared/types'
import useSettingsStore from '@/stores/settings'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, ref } from 'vue'

/**
 * Dialog for deleting a single record.
 */
const props = defineProps<{
    id: IdType
    service: ServiceType
    useUnlock: 'ALWAYS' | 'NEVER' | 'ADVANCED-MODE-CONTROLLED'
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const settingsStore = useSettingsStore()

const toggle = ref(false)

/**
 * Whether the dialog uses an unlock.
 */
const usesUnlock = computed(() => {
    return (
        props.useUnlock === 'ALWAYS' ||
        (props.useUnlock === 'ADVANCED-MODE-CONTROLLED' && !settingsStore.advancedMode)
    )
})

async function onDelete() {
    log.silentDebug('Delete dialog', { id: props.id, service: props.service })
    try {
        $q.loading.show()
        const deletedRecord = await props.service.remove(props.id)
        log.info(`Deleted ${props.service.labelSingular}`, deletedRecord)
    } catch (error) {
        log.error(`Error deleting ${props.service.labelSingular}`, error as Error)
    } finally {
        $q.loading.hide()
        onDialogOK() // Close the dialog at this point
    }
}
</script>

<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide" v-on:keyup.enter="onDelete">
        <q-card class="q-dialog-plugin">
            <q-card-section class="bg-negative text-white q-pt-sm q-pb-xs">
                <q-icon :name="deleteIcon" size="sm" class="q-pb-sm q-mr-md" />
                <span class="text-h6">Delete {{ service.labelSingular }}</span>
            </q-card-section>

            <q-card-section class="q-mt-lg">
                Are you sure you want to delete {{ id }}?
            </q-card-section>

            <q-card-section v-if="usesUnlock">
                <q-item tag="label">
                    <q-item-section>
                        <q-item-label>Unlock Required</q-item-label>
                        <q-item-label caption> Toggle this operation on to proceed. </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle
                            v-model="toggle"
                            color="negative"
                            size="xl"
                            :unchecked-icon="lockIcon"
                            :checked-icon="unlockIcon"
                        />
                    </q-item-section>
                </q-item>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" @click="onDialogCancel" />
                <q-btn
                    v-if="usesUnlock"
                    :disable="!toggle"
                    flat
                    label="Delete"
                    :color="toggle ? 'negative' : 'grey'"
                    @click="onDelete"
                />
                <q-btn v-else flat label="Delete" color="negative" @click="onDelete" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
