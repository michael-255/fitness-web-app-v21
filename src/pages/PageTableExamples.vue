<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExampleDialogs from '@/composables/useExampleDialogs'
import ExamplesService from '@/services/ExamplesService'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Examples Data Table` })

const {
    chartExampleDialog,
    inspectExampleDialog,
    createExampleDialog,
    editExampleDialog,
    deleteExampleDialog,
} = useExampleDialogs()
const examplesService = ExamplesService()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
    tableColumn('lastChild', 'Last Example Result', 'JSON'),
]
</script>

<template>
    <PageTable
        labelSingular="Example"
        labelPlural="Examples"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsCharts="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="examplesService.liveObservable()"
        @onCharts="chartExampleDialog"
        @onInspect="inspectExampleDialog"
        @onCreate="createExampleDialog"
        @onEdit="editExampleDialog"
        @onDelete="deleteExampleDialog"
    />
</template>
