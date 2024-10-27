<script setup lang="ts">
import { useQuasar } from 'quasar'

defineProps<{
    title: string
    messages: string[]
    buttonLabel: string
    buttonColor: string
}>()

const emit = defineEmits<{
    (event: 'onEmptyAction'): void
}>()

const $q = useQuasar()
</script>

<template>
    <q-item class="rounded-dashed-border q-mb-md">
        <q-item-section>
            <q-item-label class="text-h6 q-mb-md">{{ title }}</q-item-label>

            <q-item-label v-for="(message, i) in messages" :key="i" class="q-mb-md">
                {{ message }}
            </q-item-label>

            <q-item-label>
                <q-btn
                    :disable="$q.loading.isActive"
                    :color="buttonColor"
                    :label="buttonLabel"
                    class="full-width"
                    @click="emit('onEmptyAction')"
            /></q-item-label>
        </q-item-section>
    </q-item>
</template>

<style scoped>
.rounded-dashed-border {
    border-radius: 10px;
    border: 3px dashed #4caf50;
}
</style>
