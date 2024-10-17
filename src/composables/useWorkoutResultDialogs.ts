import DialogCreateWorkoutResult from '@/components/dialogs/create/DialogCreateWorkoutResult.vue'
import DialogEditWorkoutResult from '@/components/dialogs/edit/DialogEditWorkoutResult.vue'
import DialogInspectWorkoutResult from '@/components/dialogs/inspect/DialogInspectWorkoutResult.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import { SettingKeyEnum } from '@/models/Setting'
import WorkoutResult from '@/models/WorkoutResult'
import WorkoutResultService from '@/services/WorkoutResultService'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { useQuasar } from 'quasar'

export default function useWorkoutResultDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const { showDialog, onConfirmDialog } = useDialogs()
    const workoutResultService = WorkoutResultService()
    const selectedStore = useSelectedStore()
    const settingsStore = useSettingsStore()

    async function inspectWorkoutResultDialog(id: string) {
        const record = await workoutResultService.get(id)
        if (!record) {
            log.error('Workout Result not found')
            return
        }
        selectedStore.workoutResult = record
        showDialog({ component: DialogInspectWorkoutResult })
    }

    async function createWorkoutResultDialog(workoutId?: IdType) {
        if (workoutId) {
            selectedStore.workoutResult = new WorkoutResult({ workoutId })
        } else {
            selectedStore.workoutResult = new WorkoutResult({ workoutId: undefined! })
        }
        showDialog({ component: DialogCreateWorkoutResult })
    }

    async function editWorkoutResultDialog(id: string) {
        const record = await workoutResultService.get(id)
        if (!record) {
            log.error('Workout Result not found')
            return
        }
        selectedStore.workoutResult = record
        showDialog({ component: DialogEditWorkoutResult })
    }

    async function deleteWorkoutResultDialog(id: IdType) {
        const title = 'Delete Workout Result'
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
            onConfirmDialog({
                title,
                message,
                color,
                icon,
                requiresConfirmation: true,
                onOk: async () => {
                    return await confirmDeleteDialog(id)
                },
            })
        }
    }

    async function confirmDeleteDialog(id: IdType) {
        try {
            $q.loading.show()
            const deletedRecord = await workoutResultService.remove(id)
            log.info(`Deleted Workout Result`, deletedRecord)
        } catch (error) {
            log.error(`Error deleting Workout Result`, error as Error)
        } finally {
            $q.loading.hide()
        }
    }

    return {
        inspectWorkoutResultDialog,
        createWorkoutResultDialog,
        editWorkoutResultDialog,
        deleteWorkoutResultDialog,
    }
}
