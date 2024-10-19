<script setup lang="ts">
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardEmptyMessage from '@/components/dashboard/DashboardEmptyMessage.vue'
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useExerciseDialogs from '@/composables/useExerciseDialogs'
import useExerciseResultDialogs from '@/composables/useExerciseResultDialogs'
import useLogger from '@/composables/useLogger'
import type { ExerciseType } from '@/models/Exercise'
import ExerciseService from '@/services/ExerciseService'
import { appName } from '@/shared/constants'
import { RouteNameEnum, StatusEnum } from '@/shared/enums'
import { addIcon, databaseIcon, exercisesPageIcon } from '@/shared/icons'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Exercises Dashboard` })

const $q = useQuasar()
const router = useRouter()
const { log } = useLogger()
const {
    toggleFavoriteExerciseDialog,
    chartExerciseDialog,
    inspectExerciseDialog,
    createExerciseDialog,
    editExerciseDialog,
    deleteExerciseDialog,
} = useExerciseDialogs()
const { createExerciseResultDialog } = useExerciseResultDialogs()

const subscriptionFinished = ref(false)
const liveExercises: Ref<ExerciseType[]> = ref([])
const subscription = ExerciseService.liveDashboard().subscribe({
    next: (exercises) => {
        liveExercises.value = exercises
        subscriptionFinished.value = true
    },
    error: (error) => {
        log.error('Error loading live Exercises data', error as Error)
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
                    label: 'Exercises Data',
                    color: 'primary',
                    icon: databaseIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.EXERCISES_TABLE }),
                },
                {
                    label: 'Exercise Results Data',
                    color: 'warning',
                    icon: databaseIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.EXERCISE_RESULTS_TABLE }),
                },
                {
                    label: 'Create Exercise',
                    color: 'positive',
                    icon: addIcon,
                    handleClick: createExerciseDialog,
                },
            ]"
        />

        <PageHeading :headingIcon="exercisesPageIcon" headingTitle="Exercises" />

        <q-list padding>
            <DashboardEmptyMessage
                v-if="liveExercises && liveExercises.length == 0 && subscriptionFinished"
                :title="`No Activated Exercises Found`"
                :messages="[
                    'If this is your first time using the app, try creating a new Exercise below.',
                    'Don\'t see an Exercise that you created? Make sure it is not deactivated.',
                ]"
                buttonLabel="Create Exercise"
                buttonColor="positive"
                @onEmptyAction="createExerciseDialog"
            />

            <q-item v-for="exercise in liveExercises" :key="exercise.id">
                <q-item-section>
                    <DashboardCard
                        :recordName="exercise?.name"
                        :recordDesc="exercise?.desc"
                        :recordLastChildCreatedAt="exercise?.lastChild?.createdAt"
                        :recordLastChildNote="exercise?.lastChild?.note"
                        :isLoading="$q.loading.isActive"
                        :hasLastChild="!!exercise?.lastChild"
                        :hasLockedStatus="exercise.status.includes(StatusEnum.LOCKED)"
                        :hasFavoriteStatus="exercise.status.includes(StatusEnum.FAVORITED)"
                        :supportsCharts="true"
                        :supportsInspect="true"
                        :supportsEdit="true"
                        :supportsDelete="true"
                        @onCharts="chartExerciseDialog(exercise.id)"
                        @onInspect="inspectExerciseDialog(exercise.id)"
                        @onEdit="editExerciseDialog(exercise.id)"
                        @onDelete="deleteExerciseDialog(exercise.id)"
                        @onFavorite="toggleFavoriteExerciseDialog(exercise)"
                        @onAddEntry="createExerciseResultDialog(exercise.id)"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
