<script setup lang="ts">
import { compactDateFromMs } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { computed } from 'vue'
import BaseInspectItem from './BaseInspectItem.vue'

const props = defineProps<{
    label: string
    recordKey: string
}>()

const selectedStore = useSelectedStore()

const property = computed(() => selectedStore.record[props.recordKey])
</script>

<template>
    <BaseInspectItem :label="label">
        <div v-if="property">
            {{ compactDateFromMs(property) }}
        </div>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
