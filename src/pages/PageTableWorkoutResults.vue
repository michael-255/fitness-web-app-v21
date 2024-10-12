<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useWorkoutResultDialogs from '@/composables/useWorkoutResultDialogs'
import WorkoutResultService from '@/services/WorkoutResultService'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Workout Results Data Table` })

const {
    inspectWorkoutResultDialog,
    createWorkoutResultDialog,
    editWorkoutResultDialog,
    deleteWorkoutResultDialog,
} = useWorkoutResultDialogs()
const workoutResultService = WorkoutResultService()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('workoutId', 'Parent Workout Id', 'UUID'),
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('status', 'Status', 'LIST-PRINT'),
]
</script>

<template>
    <PageTable
        labelSingular="Workout Result"
        labelPlural="Workout Results"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="workoutResultService.liveObservable()"
        @onInspect="inspectWorkoutResultDialog"
        @onCreate="createWorkoutResultDialog"
        @onEdit="editWorkoutResultDialog"
        @onDelete="deleteWorkoutResultDialog"
    />
</template>
