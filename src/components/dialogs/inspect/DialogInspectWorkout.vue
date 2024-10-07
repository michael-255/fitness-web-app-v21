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
    <BaseInspectDialog :heading="'Inspect Workout'">
        <InspectItemString label="Id" :property="selectedStore.workout?.id" />
        <InspectItemDate label="Created Date" :property="selectedStore.workout?.createdAt" />
        <InspectItemString label="Name" :property="selectedStore.workout?.name" />
        <InspectItemString label="Description" :property="selectedStore.workout?.desc" />
        <InspectItemList label="Status" :property="selectedStore.workout?.status" />
        <InspectItemObject
            label="Last Workout Result"
            :property="selectedStore.workout?.lastChild"
        />
        <InspectItemObject
            label="Warmup Exercises"
            :property="selectedStore.workout?.warmupGroups"
        />
        <InspectItemObject
            label="Main Exercises"
            :property="selectedStore.workout?.exerciseGroups"
        />
        <InspectItemObject
            label="Cooldown Exercises"
            :property="selectedStore.workout?.cooldownGroups"
        />
        <InspectItemList label="Next Workouts" :property="selectedStore.workout?.nextWorkoutIds" />
    </BaseInspectDialog>
</template>
