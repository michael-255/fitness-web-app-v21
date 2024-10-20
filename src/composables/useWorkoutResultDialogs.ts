import DialogCreateWorkoutResult from '@/components/dialogs/create/DialogCreateWorkoutResult.vue'
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogEditWorkoutResult from '@/components/dialogs/edit/DialogEditWorkoutResult.vue'
import DialogInspectWorkoutResult from '@/components/dialogs/inspect/DialogInspectWorkoutResult.vue'
import useLogger from '@/composables/useLogger'
import WorkoutResult from '@/models/WorkoutResult'
import WorkoutResultService from '@/services/WorkoutResultService'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'

export default function useWorkoutResultDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const selectedStore = useSelectedStore()

    async function inspectWorkoutResultDialog(id: string) {
        const record = await WorkoutResultService.get(id)
        if (!record) {
            log.error('Workout Result not found')
            return
        }
        selectedStore.workoutResult = record
        $q.dialog({ component: DialogInspectWorkoutResult })
    }

    async function createWorkoutResultDialog(workoutId?: IdType) {
        if (workoutId) {
            selectedStore.workoutResult = new WorkoutResult({ workoutId })
        } else {
            selectedStore.workoutResult = new WorkoutResult({ workoutId: undefined! })
        }
        $q.dialog({ component: DialogCreateWorkoutResult })
    }

    async function editWorkoutResultDialog(id: string) {
        const record = await WorkoutResultService.get(id)
        if (!record) {
            log.error('Workout Result not found')
            return
        }
        selectedStore.workoutResult = record
        $q.dialog({ component: DialogEditWorkoutResult })
    }

    async function deleteWorkoutResultDialog(id: IdType) {
        $q.dialog({
            component: DialogConfirm,
            componentProps: {
                title: 'Delete Workout Result',
                message: `Are you sure you want to delete ${id}?`,
                color: 'negative',
                icon: deleteIcon,
                useConfirmationCode: 'ADVANCED-MODE-CONTROLLED',
            },
        }).onOk(async () => {
            try {
                $q.loading.show()
                const deletedRecord = await WorkoutResultService.remove(id)
                log.info(`Deleted Workout Result`, deletedRecord)
            } catch (error) {
                log.error(`Error deleting Workout Result`, error as Error)
            } finally {
                $q.loading.hide()
            }
        })
    }

    return {
        inspectWorkoutResultDialog,
        createWorkoutResultDialog,
        editWorkoutResultDialog,
        deleteWorkoutResultDialog,
    }
}
