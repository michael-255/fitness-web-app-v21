<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExampleResultDialogs from '@/composables/useExampleResultDialogs'
import ExampleResultsService from '@/services/ExampleResultsService'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Example Results Data Table` })

const {
    inspectExampleResultDialog,
    createExampleResultDialog,
    editExampleResultDialog,
    deleteExampleResultDialog,
} = useExampleResultDialogs()
const exampleResultsService = ExampleResultsService()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('parentId', 'Parent Example Id', 'UUID'), // Parent is Example
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('mockData', 'Mock Data'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
]
</script>

<template>
    <PageTable
        labelSingular="Example Result"
        labelPlural="Example Results"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="exampleResultsService.liveObservable()"
        @onInspect="inspectExampleResultDialog"
        @onCreate="createExampleResultDialog"
        @onEdit="editExampleResultDialog"
        @onDelete="deleteExampleResultDialog"
    />
</template>
