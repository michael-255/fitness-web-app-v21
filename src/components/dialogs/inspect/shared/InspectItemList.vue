<script setup lang="ts">
import BaseInspectItem from '@/components/dialogs/inspect/shared/BaseInspectItem.vue'

defineProps<{
    label: string
    property?: any[]
}>()
</script>

<template>
    <BaseInspectItem :label="label">
        <ul v-if="property && property?.length > 0" class="q-pl-sm q-my-none">
            <li v-for="i in property" :key="i" class="q-ml-sm">
                {{ i }}
            </li>
        </ul>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
