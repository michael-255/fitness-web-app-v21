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
    <BaseInspectDialog :heading="'Inspect Workout Result'">
        <InspectItemString label="Id" :property="selectedStore.workoutResult?.id" />
        <InspectItemString
            label="Parent Workout"
            :property="selectedStore.workoutResult?.workoutId"
        />
        <InspectItemDate label="Created Date" :property="selectedStore.workoutResult?.createdAt" />
        <InspectItemDate
            label="Finished Date"
            :property="selectedStore.workoutResult?.finishedAt"
        />
        <InspectItemString label="Note" :property="selectedStore.workoutResult?.note" />
        <InspectItemList label="Status" :property="selectedStore.workoutResult?.status" />
        <InspectItemObject
            label="Warmup Exercise Results"
            :property="selectedStore.workoutResult?.warmupResultGroups"
        />
        <InspectItemObject
            label="Main Exercise Results"
            :property="selectedStore.workoutResult?.exerciseResultGroups"
        />
        <InspectItemObject
            label="Cooldown Exercise Results"
            :property="selectedStore.workoutResult?.cooldownResultGroups"
        />
    </BaseInspectDialog>
</template>
