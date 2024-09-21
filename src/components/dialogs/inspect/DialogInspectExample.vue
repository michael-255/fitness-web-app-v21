<script setup lang="ts">
import useSelectedStore from '@/stores/selected'
import { onUnmounted } from 'vue'
import BaseInspectDialog from './shared/BaseInspectDialog.vue'
import InspectItemDate from './shared/InspectItemDate.vue'
import InspectItemList from './shared/InspectItemList.vue'
import InspectItemObject from './shared/InspectItemObject.vue'
import InspectItemString from './shared/InspectItemString.vue'

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <BaseInspectDialog :heading="'Inspect Example'">
        <InspectItemString label="Id" :property="selectedStore.example?.id" />
        <InspectItemDate label="Created Date" :property="selectedStore.example?.createdAt" />
        <InspectItemString label="Name" :property="selectedStore.example?.name" />
        <InspectItemString label="Description" :property="selectedStore.example?.desc" />
        <InspectItemList label="Tags" :property="selectedStore.example?.tags" />
        <InspectItemObject
            label="Last Example Result"
            :property="selectedStore.example?.lastChild"
        />
    </BaseInspectDialog>
</template>
