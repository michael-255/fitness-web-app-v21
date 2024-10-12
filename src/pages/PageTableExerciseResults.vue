<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExerciseResultDialogs from '@/composables/useExerciseResultDialogs'
import ExerciseResultService from '@/services/ExerciseResultService'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Exercise Results Data Table` })

const {
    inspectExerciseResultDialog,
    createExerciseResultDialog,
    editExerciseResultDialog,
    deleteExerciseResultDialog,
} = useExerciseResultDialogs()
const exerciseResultService = ExerciseResultService()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('exerciseId', 'Parent Exercise Id', 'UUID'),
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('status', 'Status', 'LIST-PRINT'),
]
</script>

<template>
    <PageTable
        labelSingular="Exercise Result"
        labelPlural="Exercise Results"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="exerciseResultService.liveObservable()"
        @onInspect="inspectExerciseResultDialog"
        @onCreate="createExerciseResultDialog"
        @onEdit="editExerciseResultDialog"
        @onDelete="deleteExerciseResultDialog"
    />
</template>
