<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import DB from '@/services/db'
import SettingsService from '@/services/SettingsService'
import { appName } from '@/shared/constants'
import { settingsTableIcon } from '@/shared/icons'
import { tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Settings Data Table` })

const settingsService = SettingsService(DB)

const tableColumns = [tableColumn('key', 'Key'), tableColumn('value', 'Value')]
</script>

<template>
    <PageTable
        labelSingular="Setting"
        labelPlural="Settings"
        :icon="settingsTableIcon"
        :tableColumns="tableColumns"
        :dataObservable="settingsService.liveObservable()"
    />
</template>
