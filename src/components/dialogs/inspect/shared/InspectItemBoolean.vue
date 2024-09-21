<script setup lang="ts">
import BaseInspectItem from '@/components/dialogs/inspect/shared/BaseInspectItem.vue'

defineProps<{
    label: string
    property?: boolean
}>()
</script>

<template>
    <BaseInspectItem :label="label">
        <q-chip v-if="property === true" color="positive" label="Yes" dense />
        <q-chip v-else-if="property === false" color="negative" label="No" dense />
        <div v-else>-</div>
    </BaseInspectItem>
</template>
