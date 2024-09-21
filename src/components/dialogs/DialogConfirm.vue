<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'

const props = defineProps<{
    title: string
    message: string
    color: string
    icon: string
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>

<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide" v-on:keyup.enter="onDialogOK">
        <q-card class="q-dialog-plugin">
            <q-card-section :class="`bg-${props.color} text-white q-pt-sm q-pb-xs`">
                <q-icon :name="icon" size="sm" class="q-pb-sm q-mr-md" />
                <span class="text-h6">{{ title }}</span>
            </q-card-section>

            <q-card-section class="q-mt-lg">{{ message }}</q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" @click="onDialogCancel" />
                <q-btn flat label="Confirm" :color="color" @click="onDialogOK" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
