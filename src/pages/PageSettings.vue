<script setup lang="ts">
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/db'
import ExampleResultsService from '@/services/ExampleResultsService'
import ExamplesService from '@/services/ExamplesService'
import SettingsService from '@/services/SettingsService'
import { appDatabaseVersion, appName } from '@/shared/constants'
import {
    DurationEnum,
    DurationMSEnum,
    LimitEnum,
    RouteNameEnum,
    SettingKeyEnum,
    TableEnum,
} from '@/shared/enums'
import {
    createIcon,
    databaseIcon,
    deleteIcon,
    deleteSweepIcon,
    deleteXIcon,
    donatePageIcon,
    exportFileIcon,
    importFileIcon,
    infoIcon,
    logsTableIcon,
    optionsIcon,
    settingsPageIcon,
    settingsTableIcon,
    warnIcon,
} from '@/shared/icons'
import type { BackupType } from '@/shared/types'
import { compactDateFromMs } from '@/shared/utils'
import useSettingsStore from '@/stores/settings'
import { exportFile, useMeta, useQuasar } from 'quasar'
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Settings` })

const $q = useQuasar()
const router = useRouter()
const { log } = useLogger()
const { onConfirmDialog, onStrictConfirmDialog } = useDialogs()
const settingsStore = useSettingsStore()
const settingsService = SettingsService()
const examplesService = ExamplesService()
const exampleResultsService = ExampleResultsService()

const isDevMode = import.meta.env.DEV

const importFile: Ref<any> = ref(null)

const logDurationsOptions = [
    DurationEnum['One Week'],
    DurationEnum['One Month'],
    DurationEnum['Three Months'],
    DurationEnum['Six Months'],
    DurationEnum['One Year'],
    DurationEnum.Forever,
]

/**
 * Handles rejected files during import and logs a warning.
 */
function onRejectedFile(entries: any) {
    const name = entries?.[0]?.file?.name
    const size = entries?.[0]?.file?.size
    const type = entries?.[0]?.file?.type
    log.warn(`Cannot import ${name}`, { name, size, type })
    importFile.value = null // Clear input
}

/**
 * Imports all data from a backup JSON file into the app database.
 */
function onImportBackup() {
    onConfirmDialog({
        title: 'Import',
        message: 'Import backup data from a JSON file into the app database?',
        color: 'info',
        icon: importFileIcon,
        onOk: async () => {
            try {
                $q.loading.show()

                const backup = JSON.parse(await importFile.value.text()) as BackupType
                log.silentDebug('backup:', backup)

                // NOTE: Logs are ignored during import
                const settingsImport = await settingsService.importData(backup?.settings ?? [])
                const examplesImport = await examplesService.importData(backup?.examples ?? [])
                const exampleResultsImport = await exampleResultsService.importData(
                    backup?.exampleResults ?? [],
                )

                // Check for invalid records
                const hasInvalidRecords = [
                    settingsImport.invalidRecords,
                    examplesImport.invalidRecords,
                    exampleResultsImport.invalidRecords,
                ].some((record) => Array.isArray(record) && record.length > 0)

                if (hasInvalidRecords) {
                    log.warn('Import skipping invalid records', {
                        invalidSettings: settingsImport.invalidRecords,
                        invalidExamples: examplesImport.invalidRecords,
                        invalidExampleResults: exampleResultsImport.invalidRecords,
                    })
                }

                // Check for bulk import errors
                const hasBulkErrors = [
                    examplesImport.bulkError,
                    exampleResultsImport.bulkError,
                ].some((error) => error)

                if (hasBulkErrors) {
                    log.warn('Import skipping existing records', {
                        bulkErrorExamples: examplesImport.bulkError,
                        bulkErrorExampleResults: exampleResultsImport.bulkError,
                    })
                }

                log.info('Imported available data', {
                    appName: backup.appName,
                    createdAt: backup.createdAt,
                    databaseVersion: backup.databaseVersion,
                    logsDiscarded: backup?.logs?.length ?? 0, // Logs are ignored during import
                    settingsImported: settingsImport.importedCount,
                    examplesImported: examplesImport.importedCount,
                    exampleResultsImported: exampleResultsImport.importedCount,
                })

                importFile.value = null // Clear input
            } catch (error) {
                log.error('Error during import', error as Error)
            } finally {
                $q.loading.hide()
            }
        },
    })
}

/**
 * Exports all app data into a backup JSON file.
 */
function onExportBackup() {
    const appNameSlug = appName.toLowerCase().split(' ').join('-')
    const date = new Date().toISOString().split('T')[0]
    const filename = `${appNameSlug}-${date}.json`

    onConfirmDialog({
        title: 'Export',
        message: `Export all app data into the backup file ${filename}?`,
        color: 'info',
        icon: exportFileIcon,
        onOk: async () => {
            try {
                $q.loading.show()

                const backup: BackupType = {
                    appName: appName,
                    databaseVersion: appDatabaseVersion,
                    createdAt: Date.now(),
                    settings: await DB.table(TableEnum.SETTINGS).toArray(),
                    logs: await DB.table(TableEnum.LOGS).toArray(),
                    examples: await examplesService.exportData(),
                    exampleResults: await DB.table(TableEnum.EXAMPLE_RESULTS).toArray(),
                } as BackupType

                log.silentDebug('backup:', backup)

                const exported = exportFile(filename, JSON.stringify(backup), {
                    encoding: 'UTF-8',
                    mimeType: 'application/json',
                })

                if (exported === true) {
                    log.info('Backup downloaded successfully', { filename })
                } else {
                    throw new Error('Browser denied file download')
                }
            } catch (error) {
                log.error('Export failed', error as Error)
            } finally {
                $q.loading.hide()
            }
        },
    })
}

/**
 * Deletes all app logs from the database.
 */
function onDeleteLogs() {
    onStrictConfirmDialog({
        title: 'Delete Logs',
        message: 'Are you sure you want to delete all app logs from the database?',
        color: 'negative',
        icon: deleteIcon,
        onOk: async () => {
            try {
                $q.loading.show()
                await DB.table(TableEnum.LOGS).clear()
                log.info('Successfully deleted logs')
            } catch (error) {
                log.error(`Error deleting Logs`, error as Error)
            } finally {
                $q.loading.hide()
            }
        },
    })
}

/**
 * Deletes all app data including configuration and user data from the database.
 */
function onDeleteAppData() {
    onStrictConfirmDialog({
        title: 'Delete App Data',
        message: 'Are you sure you want to delete all app data?',
        color: 'negative',
        icon: deleteXIcon,
        onOk: async () => {
            try {
                $q.loading.show()
                await settingsService.clear()
                await DB.table(TableEnum.LOGS).clear()
                await DB.table(TableEnum.EXAMPLES).clear()
                await DB.table(TableEnum.EXAMPLE_RESULTS).clear()
                log.info('Successfully deleted app data')
            } catch (error) {
                log.error(`Error deleting app data`, error as Error)
            } finally {
                $q.loading.hide()
            }
        },
    })
}

/**
 * Deletes the underlining database and all of its data.
 */
function onDeleteDatabase() {
    onStrictConfirmDialog({
        title: 'Delete Database',
        message:
            'Delete the underlining database? All data will be lost. You must reload the website after this action to reinitialize the database.',
        color: 'negative',
        icon: deleteSweepIcon,
        onOk: async () => {
            try {
                $q.loading.show()
                await DB.delete()
                $q.notify({
                    message: 'Reload the website now',
                    icon: warnIcon,
                    color: 'warning',
                })
            } catch (error) {
                log.error(`Error deleting database`, error as Error)
            } finally {
                $q.loading.hide()
            }
        },
    })
}

/**
 * Allows for the creation of test data when the app is in local DEV mode.
 */
async function createTestData() {
    // Example
    const example = new Example({
        name: `Generated: ${compactDateFromMs(Date.now())}`,
        desc: 'This is an Example description. These descriptions can be quite long and detailed at 250 characters. Here is my attempt fill this space with text that makes sense. I want to see what this looks like when you are at the limit. This is enough.',
    })

    // Example Results
    const exampleResults = []
    const numberOfDays = 600
    const currentDate = Date.now()

    // First record
    const recentExampleResult = new ExampleResult({
        parentId: example.id,
        createdAt: currentDate,
        note: 'This is the Example Result note. MOST RECENT!',
        mockData: 0,
    })
    example.lastChild = recentExampleResult
    exampleResults.push(recentExampleResult)

    for (let i = 1; i < numberOfDays; i++) {
        exampleResults.push(
            new ExampleResult({
                parentId: example.id,
                createdAt: currentDate - i * DurationMSEnum['One Day'],
                note: `This is the Example Result note: Index ${i}`,
                mockData: Math.floor(Math.random() * (i / 2)) + i / 2,
            }),
        )
    }

    await examplesService.add(example)
    await exampleResultsService.importData(exampleResults)
    log.debug('Test Example added with debug', example)
    log.warn('Test Example added with warn', example)
    log.info('Test Example added with info', example)
    log.error('Test Example added with error', example)
}
</script>

<template>
    <ResponsivePage>
        <PageFabMenu
            :isLoading="$q.loading.isActive"
            :subButtons="[
                {
                    label: 'Logs Data',
                    color: 'secondary',
                    icon: logsTableIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.LOGS_TABLE }),
                },
                {
                    label: 'Settings Data',
                    color: 'secondary',
                    icon: settingsTableIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.SETTINGS_TABLE }),
                },
                {
                    label: 'About',
                    color: 'primary',
                    icon: infoIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.ABOUT }),
                },
                {
                    label: 'Donate',
                    color: 'pink',
                    icon: donatePageIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.DONATE }),
                },
            ]"
        />

        <PageHeading :headingIcon="settingsPageIcon" headingTitle="Settings" />

        <q-list padding>
            <q-item-label header>
                <q-icon class="on-left" size="sm" :name="optionsIcon" />
                Options
            </q-item-label>

            <q-item tag="label" :disable="$q.loading.isActive">
                <q-item-section top>
                    <q-item-label>Advanced Mode</q-item-label>
                    <q-item-label caption>
                        Hides and simplifies portions of the app for more advanced users.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)"
                        @update:model-value="
                            settingsService.put({
                                key: SettingKeyEnum.ADVANCED_MODE,
                                value: $event,
                            })
                        "
                        :disable="$q.loading.isActive"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" :disable="$q.loading.isActive">
                <q-item-section top>
                    <q-item-label>Show Instructions Overlay</q-item-label>
                    <q-item-label caption>
                        Redisplays the welcome message and app usage instructions.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="
                            settingsStore.getKeyValue(SettingKeyEnum.INSTRUCTIONS_OVERLAY)
                        "
                        @update:model-value="
                            settingsService.put({
                                key: SettingKeyEnum.INSTRUCTIONS_OVERLAY,
                                value: $event,
                            })
                        "
                        :disable="$q.loading.isActive"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" :disable="$q.loading.isActive">
                <q-item-section top>
                    <q-item-label>Show Info Messages</q-item-label>
                    <q-item-label caption>
                        Show confirmation popup messages for actions that were completed.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="settingsStore.getKeyValue(SettingKeyEnum.INFO_MESSAGES)"
                        @update:model-value="
                            settingsService.put({
                                key: SettingKeyEnum.INFO_MESSAGES,
                                value: $event,
                            })
                        "
                        :disable="$q.loading.isActive"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" :disable="$q.loading.isActive">
                <q-item-section top>
                    <q-item-label>Show Console Logs</q-item-label>
                    <q-item-label caption>
                        Show all log messages in the browser console.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="settingsStore.getKeyValue(SettingKeyEnum.CONSOLE_LOGS)"
                        @update:model-value="
                            settingsService.put({
                                key: SettingKeyEnum.CONSOLE_LOGS,
                                value: $event,
                            })
                        "
                        :disable="$q.loading.isActive"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section top>
                    <q-item-label>Log Retention</q-item-label>
                    <q-item-label caption>
                        Duration that logs remain stored until being removed automatically.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-select
                        :model-value="
                            settingsStore.getKeyValue(SettingKeyEnum.LOG_RETENTION_DURATION)
                        "
                        @update:model-value="
                            settingsService.put({
                                key: SettingKeyEnum.LOG_RETENTION_DURATION,
                                value: $event,
                            })
                        "
                        :disable="$q.loading.isActive"
                        :options="logDurationsOptions"
                        dense
                        outlined
                        label="Duration"
                        class="duration-width"
                    />
                </q-item-section>
            </q-item>

            <q-separator class="q-my-md" />

            <q-item-label header>
                <q-icon class="on-left" size="sm" :name="databaseIcon" />
                Data Management
            </q-item-label>

            <q-item>
                <q-item-section top>
                    <q-item-label>Import</q-item-label>
                    <q-item-label caption>
                        Import data into the app from a JSON file. The app expects the data in the
                        file to be structured the same as the exported version. Logs are ignored
                        during imports.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
                <q-item-section top>
                    <q-file
                        v-model="importFile"
                        :disable="$q.loading.isActive"
                        clearable
                        dense
                        outlined
                        accept="application/json"
                        :max-file-size="LimitEnum.MAX_FILE_SIZE"
                        @rejected="onRejectedFile"
                    >
                        <template v-slot:before>
                            <q-btn
                                :disable="!importFile || $q.loading.isActive"
                                :icon="importFileIcon"
                                color="primary"
                                @click="onImportBackup()"
                            />
                        </template>
                    </q-file>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section top>
                    <q-item-label>Export</q-item-label>
                    <q-item-label caption>
                        Export your data as a JSON file. Do this on a regularly basis so you have a
                        backup of your data.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-btn
                    :icon="exportFileIcon"
                    :disable="$q.loading.isActive"
                    color="primary"
                    @click="onExportBackup()"
                />
            </q-item>

            <q-separator class="q-my-md" />

            <q-item-label header class="text-negative">
                <q-icon class="on-left" size="sm" :name="warnIcon" />
                Danger Zone
            </q-item-label>

            <q-item-label header>
                The following operations cannot be undone. Consider exporting your data before
                proceeding.
            </q-item-label>

            <q-item>
                <q-item-section top>
                    <q-item-label>Delete Logs</q-item-label>
                    <q-item-label caption> Delete all logging data from the app. </q-item-label>
                </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
                <q-btn
                    :icon="deleteIcon"
                    :disable="$q.loading.isActive"
                    color="negative"
                    @click="onDeleteLogs()"
                />
            </q-item>

            <q-item>
                <q-item-section top>
                    <q-item-label>Delete App Data</q-item-label>
                    <q-item-label caption>
                        Permanently delete all configuration and user data from the app.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
                <q-btn
                    :icon="deleteXIcon"
                    :disable="$q.loading.isActive"
                    color="negative"
                    @click="onDeleteAppData()"
                />
            </q-item>

            <q-item>
                <q-item-section top>
                    <q-item-label>Delete Database</q-item-label>
                    <q-item-label caption>
                        Delete the underlining browser database and all of its data (requires app
                        reload).
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-btn
                    :icon="deleteSweepIcon"
                    :disable="$q.loading.isActive"
                    color="negative"
                    @click="onDeleteDatabase()"
                />
            </q-item>

            <q-item v-if="isDevMode">
                <q-item-section top>
                    <q-item-label>Create Test Data</q-item-label>
                    <q-item-label caption>
                        Generate many records of test data for the app. This can be repeated.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item v-if="isDevMode">
                <q-btn
                    :icon="createIcon"
                    :disable="$q.loading.isActive"
                    color="accent"
                    @click="createTestData"
                />
            </q-item>
        </q-list>
    </ResponsivePage>
</template>

<style scoped>
.duration-width {
    width: 150px;
}
</style>
