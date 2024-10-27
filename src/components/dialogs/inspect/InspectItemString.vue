<script setup lang="ts">
import NewlinedTextArea from '@/components/dashboard/NewlinedTextArea.vue'
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
        <NewlinedTextArea v-if="property" :text="property" />
        <div v-else>-</div>
    </BaseInspectItem>
</template>
