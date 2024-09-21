<script setup lang="ts">
import useSelectedStore from '@/stores/selected'
import { onUnmounted } from 'vue'
import BaseInspectDialog from './shared/BaseInspectDialog.vue'
import InspectItemDate from './shared/InspectItemDate.vue'
import InspectItemList from './shared/InspectItemList.vue'
import InspectItemString from './shared/InspectItemString.vue'

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <BaseInspectDialog :heading="'Inspect Example Result'">
        <InspectItemString label="Id" :property="selectedStore.exampleResult?.id" />
        <InspectItemDate label="Created Date" :property="selectedStore.exampleResult?.createdAt" />
        <InspectItemString
            label="Parent Example Id"
            :property="selectedStore.exampleResult?.parentId"
        />
        <InspectItemString label="Note" :property="selectedStore.exampleResult?.note" />
        <InspectItemList label="Tags" :property="selectedStore.exampleResult?.tags" />
        <InspectItemString label="Mock Data" :property="selectedStore.exampleResult?.mockData" />
    </BaseInspectDialog>
</template>
