<script setup lang="ts">
import useSelectedStore from '@/stores/selected'
import { onUnmounted } from 'vue'
import BaseInspectDialog from './shared/BaseInspectDialog.vue'
import InspectItemDate from './shared/InspectItemDate.vue'
import InspectItemObject from './shared/InspectItemObject.vue'
import InspectItemString from './shared/InspectItemString.vue'

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <BaseInspectDialog :heading="'Inspect Log'">
        <InspectItemString label="Auto Id" :property="String(selectedStore.log?.autoId)" />
        <InspectItemDate label="Created Date" :property="selectedStore.log?.createdAt" />
        <InspectItemString label="Log Level" :property="selectedStore.log?.logLevel" />
        <InspectItemString label="Label" :property="selectedStore.log?.label" />
        <InspectItemObject label="Details" :property="selectedStore.log?.details" />
    </BaseInspectDialog>
</template>
