<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExerciseDialogs from '@/composables/useExerciseDialogs'
import ExerciseService from '@/services/ExerciseService'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Exercises Data Table` })

const {
    chartExerciseDialog,
    inspectExerciseDialog,
    createExerciseDialog,
    editExerciseDialog,
    deleteExerciseDialog,
} = useExerciseDialogs()
const exerciseService = ExerciseService()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('status', 'Status', 'LIST-PRINT'),
    tableColumn('lastChild', 'Last Exercise Result', 'JSON'),
    tableColumn('inputs', 'Exercise Inputs'),
    tableColumn('initialSetCount', 'Initial Set Count'),
    tableColumn('restTimer', 'Rest Timer Settings', 'JSON'),
    tableColumn('tabataTimer', 'Tabata Timer Settings', 'JSON'),
]
</script>

<template>
    <PageTable
        labelSingular="Exercise"
        labelPlural="Exercises"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsCharts="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="exerciseService.liveObservable()"
        @onCharts="chartExerciseDialog"
        @onInspect="inspectExerciseDialog"
        @onCreate="createExerciseDialog"
        @onEdit="editExerciseDialog"
        @onDelete="deleteExerciseDialog"
    />
</template>
