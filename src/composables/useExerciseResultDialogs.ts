import DialogCreateExerciseResult from '@/components/dialogs/create/DialogCreateExerciseResult.vue'
import DialogEditExerciseResult from '@/components/dialogs/edit/DialogEditExerciseResult.vue'
import DialogInspectExerciseResult from '@/components/dialogs/inspect/DialogInspectExerciseResult.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExerciseResult from '@/models/ExerciseResult'
import { SettingKeyEnum } from '@/models/Setting'
import ExerciseResultService from '@/services/ExerciseResultService'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { useQuasar } from 'quasar'

export default function useExerciseResultDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const { showDialog, onConfirmDialog, onStrictConfirmDialog } = useDialogs()
    const exerciseResultService = ExerciseResultService()
    const selectedStore = useSelectedStore()
    const settingsStore = useSettingsStore()

    async function inspectExerciseResultDialog(id: string) {
        const record = await exerciseResultService.get(id)
        if (!record) {
            log.error('Exercise Result not found')
            return
        }
        selectedStore.exerciseResult = record
        showDialog({ component: DialogInspectExerciseResult })
    }

    async function createExerciseResultDialog(exerciseId?: IdType) {
        if (exerciseId) {
            selectedStore.exerciseResult = new ExerciseResult({ exerciseId })
        } else {
            selectedStore.exerciseResult = new ExerciseResult({ exerciseId: undefined! })
        }
        showDialog({ component: DialogCreateExerciseResult })
    }

    async function editExerciseResultDialog(id: string) {
        const record = await exerciseResultService.get(id)
        if (!record) {
            log.error('Exercise Result not found')
            return
        }
        selectedStore.exerciseResult = record
        showDialog({ component: DialogEditExerciseResult })
    }

    async function deleteExerciseResultDialog(id: IdType) {
        const title = 'Delete Exercise Result'
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
            const deletedRecord = await exerciseResultService.remove(id)
            log.info(`Deleted Exercise Result`, deletedRecord)
        } catch (error) {
            log.error(`Error deleting Exercise Result`, error as Error)
        } finally {
            $q.loading.hide()
        }
    }

    return {
        inspectExerciseResultDialog,
        createExerciseResultDialog,
        editExerciseResultDialog,
        deleteExerciseResultDialog,
    }
}
