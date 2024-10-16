import DialogCreateWorkout from '@/components/dialogs/create/DialogCreateWorkout.vue'
import DialogEditWorkout from '@/components/dialogs/edit/DialogEditWorkout.vue'
import DialogInspectWorkout from '@/components/dialogs/inspect/DialogInspectWorkout.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import { SettingKeyEnum } from '@/models/Setting'
import type { WorkoutType } from '@/models/Workout'
import Workout from '@/models/Workout'
import WorkoutService from '@/services/WorkoutService'
import { StatusEnum } from '@/shared/enums'
import { deleteIcon, favoriteOffIcon, favoriteOnIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { extend, useQuasar } from 'quasar'

export default function useWorkoutDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const { showDialog, onConfirmDialog } = useDialogs()
    const workoutService = WorkoutService()
    const selectedStore = useSelectedStore()
    const settingsStore = useSettingsStore()

    function toggleFavoriteWorkoutDialog(workout: WorkoutType) {
        // Deep copy to prevent issues with the database calls later
        const record: WorkoutType = extend(true, {}, workout)
        const action = record.status.includes(StatusEnum.FAVORITED) ? 'Unfavorite' : 'Favorite'
        const message = `Do you want to ${action.toLocaleLowerCase()} ${record.name}?`
        const icon = record.status.includes(StatusEnum.FAVORITED) ? favoriteOffIcon : favoriteOnIcon

        onConfirmDialog({
            title: action,
            message,
            color: 'info',
            icon,
            onOk: async () => {
                try {
                    $q.loading.show()
                    await workoutService.toggleFavorite(record)
                    log.info(`${action}d ${record.name}`, record)
                } catch (error) {
                    log.error(`${action} failed`, error as Error)
                } finally {
                    $q.loading.hide()
                }
            },
        })
    }

    async function chartWorkoutDialog(id: string) {
        const record = await workoutService.get(id)
        if (!record) {
            log.error('Workout not found')
            return
        }
        selectedStore.workout = record
        // TODO
        // showDialog({ component: DialogChartWorkout })
    }

    async function inspectWorkoutDialog(id: string) {
        const record = await workoutService.get(id)
        if (!record) {
            log.error('Workout not found')
            return
        }
        selectedStore.workout = record
        showDialog({ component: DialogInspectWorkout })
    }

    async function createWorkoutDialog() {
        selectedStore.workout = new Workout({})
        showDialog({ component: DialogCreateWorkout })
    }

    async function editWorkoutDialog(id: string) {
        const record = await workoutService.get(id)
        if (!record) {
            log.error('Workout not found')
            return
        }
        selectedStore.workout = record
        showDialog({ component: DialogEditWorkout })
    }

    async function deleteWorkoutDialog(id: IdType) {
        const title = 'Delete Workout'
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
            const deletedRecord = await workoutService.remove(id)
            log.info(`Deleted Workout`, deletedRecord)
        } catch (error) {
            log.error(`Error deleting Workout`, error as Error)
        } finally {
            $q.loading.hide()
        }
    }

    return {
        toggleFavoriteWorkoutDialog,
        chartWorkoutDialog,
        inspectWorkoutDialog,
        createWorkoutDialog,
        editWorkoutDialog,
        deleteWorkoutDialog,
    }
}
