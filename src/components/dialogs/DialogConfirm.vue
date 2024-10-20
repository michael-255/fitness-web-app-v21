<script setup lang="ts">
import useSettingsStore from '@/stores/settings'
import { useDialogPluginComponent } from 'quasar'
import { computed, ref } from 'vue'

const props = defineProps<{
    title: string
    message: string
    color: string
    icon: string
    useConfirmationCode: 'ALWAYS' | 'NEVER' | 'ADVANCED-MODE-CONTROLLED'
    confirmationCode?: string
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const settingsStore = useSettingsStore()

/**
 * Converting the code to all uppercase so user doesn't have to worry about case sensitivity.
 * Default confirmation code is 'YES' if no prop is provided.
 */
const confirmationCode = (props.confirmationCode ?? 'YES').toLocaleUpperCase()
const input = ref('')

/**
 * Whether the dialog uses a confirmation code.
 */
const usesConfirmationCode = computed(() => {
    return (
        props.useConfirmationCode === 'ALWAYS' ||
        (props.useConfirmationCode === 'ADVANCED-MODE-CONTROLLED' && !settingsStore.advancedMode)
    )
})
</script>

<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide" v-on:keyup.enter="onDialogOK">
        <q-card class="q-dialog-plugin">
            <q-card-section :class="`bg-${props.color} text-white q-pt-sm q-pb-xs`">
                <q-icon :name="icon" size="sm" class="q-pb-sm q-mr-md" />
                <span class="text-h6">{{ title }}</span>
            </q-card-section>

            <q-card-section class="q-mt-lg">{{ message }}</q-card-section>

            <q-card-section v-if="usesConfirmationCode">
                Enter "{{ confirmationCode }}" below to unlock the confirm button.
            </q-card-section>

            <q-card-section v-if="usesConfirmationCode">
                <q-input
                    class="text-h6"
                    autofocus
                    outlined
                    v-model="input"
                    @update:model-value="input = input.toLocaleUpperCase()"
                />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" @click="onDialogCancel" />
                <q-btn
                    v-if="usesConfirmationCode"
                    :disable="input !== confirmationCode"
                    flat
                    label="Confirm"
                    :color="color"
                    @click="onDialogOK"
                />
                <q-btn v-else flat label="Confirm" :color="color" @click="onDialogOK" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
