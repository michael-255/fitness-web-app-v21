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
        <ul v-if="property && property?.length > 0" class="q-pl-sm q-my-none">
            <li v-for="i in property" :key="i" class="q-ml-sm">
                {{ i }}
            </li>
        </ul>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
