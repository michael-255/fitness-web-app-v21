<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useWorkoutDialogs from '@/composables/useWorkoutDialogs'
import WorkoutService from '@/services/WorkoutService'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Workouts Data Table` })

const {
    chartWorkoutDialog,
    inspectWorkoutDialog,
    createWorkoutDialog,
    editWorkoutDialog,
    deleteWorkoutDialog,
} = useWorkoutDialogs()
const workoutService = WorkoutService()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('status', 'Status', 'LIST-PRINT'),
    tableColumn('lastChild', 'Last Workout Result', 'JSON'),
    tableColumn('warmupGroups', 'Warmup Exercises', 'JSON'),
    tableColumn('exerciseGroups', 'Main Exercises', 'JSON'),
    tableColumn('cooldownGroups', 'Cooldown Exercises', 'JSON'),
    tableColumn('nextWorkoutIds', 'Next Workouts', 'LIST-PRINT'),
]
</script>

<template>
    <PageTable
        labelSingular="Workout"
        labelPlural="Workouts"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsCharts="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="workoutService.liveObservable()"
        @onCharts="chartWorkoutDialog"
        @onInspect="inspectWorkoutDialog"
        @onCreate="createWorkoutDialog"
        @onEdit="editWorkoutDialog"
        @onDelete="deleteWorkoutDialog"
    />
</template>
