import DialogCreateExercise from '@/components/dialogs/create/DialogCreateExercise.vue'
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogEditExercise from '@/components/dialogs/edit/DialogEditExercise.vue'
import DialogInspectExercise from '@/components/dialogs/inspect/DialogInspectExercise.vue'
import useLogger from '@/composables/useLogger'
import type { ExerciseType } from '@/models/Exercise'
import Exercise, { ExerciseInputEnum } from '@/models/Exercise'
import ExerciseService from '@/services/ExerciseService'
import { StatusEnum } from '@/shared/enums'
import { deleteIcon, favoriteOffIcon, favoriteOnIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { extend, useQuasar } from 'quasar'

export default function useExerciseDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const selectedStore = useSelectedStore()

    function toggleFavoriteExerciseDialog(exercise: ExerciseType) {
        // Deep copy to prevent issues with the database calls later
        const record: ExerciseType = extend(true, {}, exercise)
        const action = record.status.includes(StatusEnum.FAVORITED) ? 'Unfavorite' : 'Favorite'
        const message = `Do you want to ${action.toLocaleLowerCase()} ${record.name}?`
        const icon = record.status.includes(StatusEnum.FAVORITED) ? favoriteOffIcon : favoriteOnIcon

        $q.dialog({
            component: DialogConfirm,
            componentProps: {
                title: action,
                message,
                color: 'info',
                icon,
                useConfirmationCode: 'NEVER',
            },
        }).onOk(async () => {
            try {
                $q.loading.show()
                await ExerciseService.toggleFavorite(record)
                log.info(`${action}d ${record.name}`, record)
            } catch (error) {
                log.error(`${action} failed`, error as Error)
            } finally {
                $q.loading.hide()
            }
        })
    }

    async function chartExerciseDialog(id: string) {
        const record = await ExerciseService.get(id)
        if (!record) {
            log.error('Exercise not found')
            return
        }
        selectedStore.exercise = record
        // TODO
        // $q.dialog({ component: DialogChartExercise })
    }

    async function inspectExerciseDialog(id: string) {
        const record = await ExerciseService.get(id)
        if (!record) {
            log.error('Exercise not found')
            return
        }
        selectedStore.exercise = record
        $q.dialog({ component: DialogInspectExercise })
    }

    async function createExerciseDialog() {
        selectedStore.exercise = new Exercise({ inputs: ExerciseInputEnum.CHECKLIST })
        $q.dialog({ component: DialogCreateExercise })
    }

    async function editExerciseDialog(id: string) {
        const record = await ExerciseService.get(id)
        if (!record) {
            log.error('Exercise not found')
            return
        }
        selectedStore.exercise = record
        $q.dialog({ component: DialogEditExercise })
    }

    async function deleteExerciseDialog(id: IdType) {
        $q.dialog({
            component: DialogConfirm,
            componentProps: {
                title: 'Delete Exercise',
                message: `Are you sure you want to delete ${id}?`,
                color: 'negative',
                icon: deleteIcon,
                useConfirmationCode: 'ADVANCED-MODE-CONTROLLED',
            },
        }).onOk(async () => {
            try {
                $q.loading.show()
                const deletedRecord = await ExerciseService.remove(id)
                log.info(`Deleted Exercise`, deletedRecord)
            } catch (error) {
                log.error(`Error deleting Exercise`, error as Error)
            } finally {
                $q.loading.hide()
            }
        })
    }

    return {
        toggleFavoriteExerciseDialog,
        chartExerciseDialog,
        inspectExerciseDialog,
        createExerciseDialog,
        editExerciseDialog,
        deleteExerciseDialog,
    }
}
