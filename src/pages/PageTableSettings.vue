<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import SettingService from '@/services/SettingService'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Settings Data Table` })
</script>

<template>
    <PageTable
        :labelSingular="SettingService.labelSingular"
        :labelPlural="SettingService.labelPlural"
        :icon="SettingService.tableIcon"
        :tableColumns="SettingService.tableColumns"
        :supportsColumnFilters="SettingService.supportsTableColumnFilters"
        :supportsTableCharts="SettingService.supportsTableCharts"
        :supportsInspect="SettingService.supportsInspect"
        :supportsCreate="SettingService.supportsCreate"
        :supportsEdit="SettingService.supportsEdit"
        :supportsDelete="SettingService.supportsDelete"
        :dataObservable="SettingService.liveObservable()"
    />
</template>
