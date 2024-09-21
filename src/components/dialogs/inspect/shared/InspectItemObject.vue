<script setup lang="ts">
import BaseInspectItem from '@/components/dialogs/inspect/shared/BaseInspectItem.vue'

defineProps<{
    label: string
    property?: Record<string, any>
}>()
</script>

<template>
    <BaseInspectItem :label="label">
        <ul v-if="property && Object.keys(property).length > 0" class="q-pl-sm q-my-none">
            <li v-for="(v, k) in property" :key="k" class="q-ml-sm">{{ k }}: {{ v }}</li>
        </ul>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
