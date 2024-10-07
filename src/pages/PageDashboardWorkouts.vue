<script setup lang="ts">
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardEmptyMessage from '@/components/dashboard/DashboardEmptyMessage.vue'
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useLogger from '@/composables/useLogger'
import useWorkoutDialogs from '@/composables/useWorkoutDialogs'
import useWorkoutResultDialogs from '@/composables/useWorkoutResultDialogs'
import type { WorkoutType } from '@/models/Workout'
import WorkoutService from '@/services/WorkoutService'
import { appName } from '@/shared/constants'
import { RouteNameEnum, StatusEnum } from '@/shared/enums'
import { addIcon, databaseIcon, workoutsPageIcon } from '@/shared/icons'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Workouts Dashboard` })

const $q = useQuasar()
const router = useRouter()
const { log } = useLogger()
const {
    toggleFavoriteWorkoutDialog,
    chartWorkoutDialog,
    inspectWorkoutDialog,
    createWorkoutDialog,
    editWorkoutDialog,
    deleteWorkoutDialog,
} = useWorkoutDialogs()
const { createWorkoutResultDialog } = useWorkoutResultDialogs()
const workoutService = WorkoutService()

const subscriptionFinished = ref(false)
const liveWorkouts: Ref<WorkoutType[]> = ref([])
const subscription = workoutService.liveDashboardObservable().subscribe({
    next: (workouts) => {
        liveWorkouts.value = workouts
        subscriptionFinished.value = true
    },
    error: (error) => {
        log.error('Error loading live Workouts data', error as Error)
        subscriptionFinished.value = true
    },
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <ResponsivePage>
        <PageFabMenu
            :isLoading="$q.loading.isActive"
            :subButtons="[
                {
                    label: 'Workouts Data',
                    color: 'primary',
                    icon: databaseIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.WORKOUTS_TABLE }),
                },
                {
                    label: 'Workout Results Data',
                    color: 'warning',
                    icon: databaseIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.WORKOUT_RESULTS_TABLE }),
                },
                {
                    label: 'Create Workout',
                    color: 'positive',
                    icon: addIcon,
                    handleClick: createWorkoutDialog,
                },
            ]"
        />

        <PageHeading :headingIcon="workoutsPageIcon" headingTitle="Workouts" />

        <q-list padding>
            <DashboardEmptyMessage
                v-if="liveWorkouts && liveWorkouts.length == 0 && subscriptionFinished"
                :title="`No Activated Workouts Found`"
                :messages="[
                    'If this is your first time using the app, try creating a new Workout below.',
                    'Don\'t see an Workout that you created? Make sure it is not deactivated.',
                ]"
                buttonLabel="Create Workout"
                buttonColor="positive"
                @onEmptyAction="createWorkoutDialog"
            />

            <q-item v-for="workout in liveWorkouts" :key="workout.id">
                <q-item-section>
                    <DashboardCard
                        :recordName="workout?.name"
                        :recordDesc="workout?.desc"
                        :recordLastChildCreatedAt="workout?.lastChild?.createdAt"
                        :recordLastChildNote="workout?.lastChild?.note"
                        :isLoading="$q.loading.isActive"
                        :hasLastChild="!!workout?.lastChild"
                        :hasLockedStatus="workout.status.includes(StatusEnum.LOCKED)"
                        :hasFavoriteStatus="workout.status.includes(StatusEnum.FAVORITED)"
                        :supportsCharts="true"
                        :supportsInspect="true"
                        :supportsEdit="true"
                        :supportsDelete="true"
                        @onCharts="chartWorkoutDialog(workout.id)"
                        @onInspect="inspectWorkoutDialog(workout.id)"
                        @onEdit="editWorkoutDialog(workout.id)"
                        @onDelete="deleteWorkoutDialog(workout.id)"
                        @onFavorite="toggleFavoriteWorkoutDialog(workout)"
                        @onAddEntry="createWorkoutResultDialog(workout.id)"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
