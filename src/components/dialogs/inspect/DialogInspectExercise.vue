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
    <BaseInspectDialog :heading="'Inspect Exercise'">
        <InspectItemString label="Id" :property="selectedStore.exercise?.id" />
        <InspectItemDate label="Created Date" :property="selectedStore.exercise?.createdAt" />
        <InspectItemString label="Name" :property="selectedStore.exercise?.name" />
        <InspectItemString label="Description" :property="selectedStore.exercise?.desc" />
        <InspectItemList label="Status" :property="selectedStore.exercise?.status" />
        <InspectItemObject
            label="Last Exercise Result"
            :property="selectedStore.exercise?.lastChild"
        />
        <InspectItemString label="Exercise Inputs" :property="selectedStore.exercise?.inputs" />
        <InspectItemString
            label="Initial Set Count"
            :property="selectedStore.exercise?.initialSetCount"
        />
        <InspectItemObject
            label="Rest Timer Settings"
            :property="selectedStore.exercise?.restTimer"
        />
        <InspectItemObject
            label="Tabata Timer Settings"
            :property="selectedStore.exercise?.tabataTimer"
        />
    </BaseInspectDialog>
</template>
