<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useWorkoutResultDialogs from '@/composables/useWorkoutResultDialogs'
import WorkoutResultService from '@/services/WorkoutResultService'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Workout Results Data Table` })

const {
    inspectWorkoutResultDialog,
    createWorkoutResultDialog,
    editWorkoutResultDialog,
    deleteWorkoutResultDialog,
} = useWorkoutResultDialogs()
</script>

<template>
    <PageTable
        :labelSingular="WorkoutResultService.labelSingular"
        :labelPlural="WorkoutResultService.labelPlural"
        :icon="WorkoutResultService.tableIcon"
        :tableColumns="WorkoutResultService.tableColumns"
        :supportsTableColumnFilters="WorkoutResultService.supportsTableColumnFilters"
        :supportsTableCharts="WorkoutResultService.supportsTableCharts"
        :supportsInspect="WorkoutResultService.supportsInspect"
        :supportsCreate="WorkoutResultService.supportsCreate"
        :supportsEdit="WorkoutResultService.supportsEdit"
        :supportsDelete="WorkoutResultService.supportsDelete"
        :dataObservable="WorkoutResultService.liveTable()"
        @onInspect="inspectWorkoutResultDialog"
        @onCreate="createWorkoutResultDialog"
        @onEdit="editWorkoutResultDialog"
        @onDelete="deleteWorkoutResultDialog"
    />
</template>
