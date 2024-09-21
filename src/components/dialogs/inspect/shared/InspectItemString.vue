<script setup lang="ts">
import BaseInspectItem from '@/components/dialogs/inspect/shared/BaseInspectItem.vue'

defineProps<{
    label: string
    property?: any // Stringifies the property
}>()
</script>

<template>
    <BaseInspectItem :label="label">
        <div v-if="property">{{ property }}</div>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
