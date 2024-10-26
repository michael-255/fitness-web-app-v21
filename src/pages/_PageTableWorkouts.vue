<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useWorkoutDialogs from '@/composables/useWorkoutDialogs'
import WorkoutService from '@/services/WorkoutService'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Workouts Data Table` })

const {
    chartWorkoutDialog,
    inspectWorkoutDialog,
    createWorkoutDialog,
    editWorkoutDialog,
    deleteWorkoutDialog,
} = useWorkoutDialogs()
</script>

<template>
    <PageTable
        :labelSingular="WorkoutService.labelSingular"
        :labelPlural="WorkoutService.labelPlural"
        :icon="WorkoutService.tableIcon"
        :tableColumns="WorkoutService.tableColumns"
        :supportsTableColumnFilters="WorkoutService.supportsTableColumnFilters"
        :supportsTableCharts="WorkoutService.supportsTableCharts"
        :supportsCharts="WorkoutService.supportsCharts"
        :supportsInspect="WorkoutService.supportsInspect"
        :supportsCreate="WorkoutService.supportsCreate"
        :supportsEdit="WorkoutService.supportsEdit"
        :supportsDelete="WorkoutService.supportsDelete"
        :dataObservable="WorkoutService.liveTable()"
        @onCharts="chartWorkoutDialog"
        @onInspect="inspectWorkoutDialog"
        @onCreate="createWorkoutDialog"
        @onEdit="editWorkoutDialog"
        @onDelete="deleteWorkoutDialog"
    />
</template>
