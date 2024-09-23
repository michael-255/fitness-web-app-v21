<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import SettingService from '@/services/SettingService'
import { appName } from '@/shared/constants'
import { settingsTableIcon } from '@/shared/icons'
import { tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Settings Data Table` })

const settingService = SettingService()

const tableColumns = [tableColumn('key', 'Key'), tableColumn('value', 'Value')]
</script>

<template>
    <PageTable
        labelSingular="Setting"
        labelPlural="Settings"
        :icon="settingsTableIcon"
        :tableColumns="tableColumns"
        :dataObservable="settingService.liveObservable()"
    />
</template>
