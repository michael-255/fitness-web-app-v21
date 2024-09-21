<script setup lang="ts">
import BaseInspectItem from '@/components/dialogs/inspect/shared/BaseInspectItem.vue'
import { compactDateFromMs } from '@/shared/utils'

defineProps<{
    label: string
    property?: number
}>()
</script>

<template>
    <BaseInspectItem :label="label">
        <div v-if="property">
            {{ compactDateFromMs(property) }}
        </div>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
