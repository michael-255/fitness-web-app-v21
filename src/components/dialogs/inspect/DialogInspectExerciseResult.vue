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
    <BaseInspectDialog :heading="'Inspect Exercise Result'">
        <InspectItemString label="Id" :property="selectedStore.exerciseResult?.id" />
        <InspectItemString
            label="Parent Exercise"
            :property="selectedStore.exerciseResult?.exerciseId"
        />
        <InspectItemDate label="Created Date" :property="selectedStore.exerciseResult?.createdAt" />
        <InspectItemString label="Note" :property="selectedStore.exerciseResult?.note" />
        <InspectItemList label="Status" :property="selectedStore.exerciseResult?.status" />

        <InspectItemObject
            label="Checklist Sets"
            :property="selectedStore.exerciseResult?.checklistSets"
        />
        <InspectItemObject
            label="Cardio Sets"
            :property="selectedStore.exerciseResult?.cardioSets"
        />
        <InspectItemObject
            label="Weightlifting Sets"
            :property="selectedStore.exerciseResult?.weightSets"
        />
        <InspectItemObject
            label="Sided Weightlifting Sets"
            :property="selectedStore.exerciseResult?.sidedWeightSets"
        />
        <InspectItemObject
            label="Climbing Session"
            :property="selectedStore.exerciseResult?.climbingSets"
        />
    </BaseInspectDialog>
</template>
