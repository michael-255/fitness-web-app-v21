<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExerciseResultDialogs from '@/composables/useExerciseResultDialogs'
import ExerciseResultService from '@/services/ExerciseResultService'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Exercise Results Data Table` })

const {
    inspectExerciseResultDialog,
    createExerciseResultDialog,
    editExerciseResultDialog,
    deleteExerciseResultDialog,
} = useExerciseResultDialogs()
</script>

<template>
    <PageTable
        :labelSingular="ExerciseResultService.labelSingular"
        :labelPlural="ExerciseResultService.labelPlural"
        :icon="ExerciseResultService.tableIcon"
        :tableColumns="ExerciseResultService.tableColumns"
        :supportsTableColumnFilters="ExerciseResultService.supportsTableColumnFilters"
        :supportsTableCharts="ExerciseResultService.supportsTableCharts"
        :supportsInspect="ExerciseResultService.supportsInspect"
        :supportsCreate="ExerciseResultService.supportsCreate"
        :supportsEdit="ExerciseResultService.supportsEdit"
        :supportsDelete="ExerciseResultService.supportsDelete"
        :dataObservable="ExerciseResultService.liveObservable()"
        @onInspect="inspectExerciseResultDialog"
        @onCreate="createExerciseResultDialog"
        @onEdit="editExerciseResultDialog"
        @onDelete="deleteExerciseResultDialog"
    />
</template>
