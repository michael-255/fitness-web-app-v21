<script setup lang="ts">
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
        <q-chip v-if="property === true" color="positive" label="Yes" dense />
        <q-chip v-else-if="property === false" color="negative" label="No" dense />
        <div v-else>-</div>
    </BaseInspectItem>
</template>
