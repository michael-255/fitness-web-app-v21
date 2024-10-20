import DialogCreateExerciseResult from '@/components/dialogs/create/DialogCreateExerciseResult.vue'
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogEditExerciseResult from '@/components/dialogs/edit/DialogEditExerciseResult.vue'
import DialogInspectExerciseResult from '@/components/dialogs/inspect/DialogInspectExerciseResult.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExerciseResult from '@/models/ExerciseResult'
import ExerciseResultService from '@/services/ExerciseResultService'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'

export default function useExerciseResultDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const { showDialog } = useDialogs()
    const selectedStore = useSelectedStore()

    async function inspectExerciseResultDialog(id: string) {
        const record = await ExerciseResultService.get(id)
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
        const record = await ExerciseResultService.get(id)
        if (!record) {
            log.error('Exercise Result not found')
            return
        }
        selectedStore.exerciseResult = record
        showDialog({ component: DialogEditExerciseResult })
    }

    async function deleteExerciseResultDialog(id: IdType) {
        $q.dialog({
            component: DialogConfirm,
            componentProps: {
                title: 'Delete Exercise Result',
                message: `Are you sure you want to delete ${id}?`,
                color: 'negative',
                icon: deleteIcon,
                useConfirmationCode: 'ADVANCED-MODE-CONTROLLED',
            },
        }).onOk(async () => {
            try {
                $q.loading.show()
                const deletedRecord = await ExerciseResultService.remove(id)
                log.info(`Deleted Exercise Result`, deletedRecord)
            } catch (error) {
                log.error(`Error deleting Exercise Result`, error as Error)
            } finally {
                $q.loading.hide()
            }
        })
    }

    return {
        inspectExerciseResultDialog,
        createExerciseResultDialog,
        editExerciseResultDialog,
        deleteExerciseResultDialog,
    }
}
