<script setup lang="ts">
import DialogChartLogs from '@/components/dialogs/chart/DialogChartLogs.vue'
import DialogInspectLog from '@/components/dialogs/inspect/DialogInspectLog.vue'
import PageTable from '@/components/tables/PageTable.vue'
import useLogger from '@/composables/useLogger'
import LogService from '@/services/LogService'
import { appName } from '@/shared/constants'
import useSelectedStore from '@/stores/selected'
import { useMeta, useQuasar } from 'quasar'

useMeta({ title: `${appName} - Logs Data Table` })

const $q = useQuasar()
const { log } = useLogger()
const selectedStore = useSelectedStore()

/**
 * Opens charts dialog for Logs. This is defined here since it is the only place it is used.
 */
async function chartLogsDialog() {
    $q.dialog({ component: DialogChartLogs })
}

/**
 * Opens inspect dialog for Logs. This is defined here since it is the only place it is used.
 */
async function inspectLogDialog(id: string) {
    const record = await LogService.get(Number(id)) // Log Auto IDs are numbers
    if (!record) {
        log.error('Log not found')
    }
    selectedStore.log = record
    // Only use this where needed so this component isn't being needlessly imported
    $q.dialog({ component: DialogInspectLog })
}
</script>

<template>
    <PageTable
        :labelSingular="LogService.labelSingular"
        :labelPlural="LogService.labelPlural"
        :icon="LogService.tableIcon"
        :tableColumns="LogService.tableColumns"
        :supportsColumnFilters="LogService.supportsTableColumnFilters"
        :supportsTableCharts="LogService.supportsTableCharts"
        :supportsInspect="LogService.supportsInspect"
        :supportsCreate="LogService.supportsCreate"
        :supportsEdit="LogService.supportsEdit"
        :supportsDelete="LogService.supportsDelete"
        :dataObservable="LogService.liveTable()"
        @onTableCharts="chartLogsDialog"
        @onInspect="inspectLogDialog"
    />
</template>
