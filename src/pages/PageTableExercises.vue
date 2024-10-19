<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExerciseDialogs from '@/composables/useExerciseDialogs'
import ExerciseService from '@/services/ExerciseService'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Exercises Data Table` })

const {
    chartExerciseDialog,
    inspectExerciseDialog,
    createExerciseDialog,
    editExerciseDialog,
    deleteExerciseDialog,
} = useExerciseDialogs()
</script>

<template>
    <PageTable
        :labelSingular="ExerciseService.labelSingular"
        :labelPlural="ExerciseService.labelPlural"
        :icon="ExerciseService.tableIcon"
        :tableColumns="ExerciseService.tableColumns"
        :supportsTableColumnFilters="ExerciseService.supportsTableColumnFilters"
        :supportsTableCharts="ExerciseService.supportsTableCharts"
        :supportsCharts="ExerciseService.supportsCharts"
        :supportsInspect="ExerciseService.supportsInspect"
        :supportsCreate="ExerciseService.supportsCreate"
        :supportsEdit="ExerciseService.supportsEdit"
        :supportsDelete="ExerciseService.supportsDelete"
        :dataObservable="ExerciseService.liveObservable()"
        @onCharts="chartExerciseDialog"
        @onInspect="inspectExerciseDialog"
        @onCreate="createExerciseDialog"
        @onEdit="editExerciseDialog"
        @onDelete="deleteExerciseDialog"
    />
</template>
