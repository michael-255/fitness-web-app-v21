import DialogCreateExampleResult from '@/components/dialogs/create/DialogCreateExampleResult.vue'
import DialogEditExampleResult from '@/components/dialogs/edit/DialogEditExampleResult.vue'
import DialogInspectExampleResult from '@/components/dialogs/inspect/DialogInspectExampleResult.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResult from '@/models/ExampleResult'
import ExampleResultsService from '@/services/ExampleResultsService'
import { SettingKeyEnum } from '@/shared/enums'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { useQuasar } from 'quasar'

export default function useExampleResultDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const { showDialog, onConfirmDialog, onStrictConfirmDialog } = useDialogs()
    const exampleResultsService = ExampleResultsService()
    const selectedStore = useSelectedStore()
    const settingsStore = useSettingsStore()

    async function inspectExampleResultDialog(id: string) {
        const record = await exampleResultsService.get(id)
        if (!record) {
            log.error('Example Result not found')
            return
        }
        selectedStore.exampleResult = record
        showDialog({ component: DialogInspectExampleResult })
    }

    async function createExampleResultDialog(parentId?: IdType) {
        if (parentId) {
            selectedStore.exampleResult = new ExampleResult({ parentId })
        } else {
            selectedStore.exampleResult = new ExampleResult({ parentId: undefined! })
        }
        showDialog({ component: DialogCreateExampleResult })
    }

    async function editExampleResultDialog(id: string) {
        const record = await exampleResultsService.get(id)
        if (!record) {
            log.error('Example Result not found')
            return
        }
        selectedStore.exampleResult = record
        showDialog({ component: DialogEditExampleResult })
    }

    async function deleteExampleResultDialog(id: IdType) {
        const title = 'Delete Example Result'
        const message = `Are you sure you want to delete ${id}?`
        const color = 'negative'
        const icon = deleteIcon

        if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
            onConfirmDialog({
                title,
                message,
                color,
                icon,
                onOk: async () => {
                    return await confirmDeleteDialog(id)
                },
            })
        } else {
            onStrictConfirmDialog({
                title,
                message,
                color,
                icon,
                onOk: async () => {
                    return await confirmDeleteDialog(id)
                },
            })
        }
    }

    async function confirmDeleteDialog(id: IdType) {
        try {
            $q.loading.show()
            const deletedRecord = await exampleResultsService.remove(id)
            log.info(`Deleted Example Result`, deletedRecord)
        } catch (error) {
            log.error(`Error deleting Example Result`, error as Error)
        } finally {
            $q.loading.hide()
        }
    }

    return {
        inspectExampleResultDialog,
        createExampleResultDialog,
        editExampleResultDialog,
        deleteExampleResultDialog,
    }
}
