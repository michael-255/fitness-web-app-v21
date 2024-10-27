<script setup lang="ts">
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardEmptyMessage from '@/components/dashboard/DashboardEmptyMessage.vue'
import PageFabMenu from '@/components/page/PageFabMenu.vue'
import PageHeading from '@/components/page/PageHeading.vue'
import PageResponsive from '@/components/page/PageResponsive.vue'
import useLogger from '@/composables/useLogger'
import type { WorkoutType } from '@/models/Workout'
import WorkoutResultService from '@/services/WorkoutResultService'
import WorkoutService from '@/services/WorkoutService'
import { appName } from '@/shared/constants'
import { RouteNameEnum, StatusEnum, TableEnum } from '@/shared/enums'
import { addIcon, databaseIcon, workoutsPageIcon } from '@/shared/icons'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Workouts Dashboard` })

const $q = useQuasar()
const router = useRouter()
const { log } = useLogger()

const subscriptionFinished = ref(false)
const liveRecords: Ref<WorkoutType[]> = ref([])
const subscription = WorkoutService.liveDashboard().subscribe({
    next: (records) => {
        liveRecords.value = records
        subscriptionFinished.value = true
    },
    error: (error) => {
        log.error(`Error loading live ${WorkoutService.labelPlural} data`, error as Error)
        subscriptionFinished.value = true
    },
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <PageResponsive>
        <PageFabMenu
            :isLoading="$q.loading.isActive"
            :subButtons="[
                {
                    label: 'Workouts Data',
                    color: 'primary',
                    icon: databaseIcon,
                    handleClick: () =>
                        router.push({
                            name: RouteNameEnum.TABLE,
                            params: { table: TableEnum.WORKOUTS },
                        }),
                },
                {
                    label: 'Workout Results Data',
                    color: 'secondary',
                    icon: databaseIcon,
                    handleClick: () =>
                        router.push({
                            name: RouteNameEnum.TABLE,
                            params: { table: TableEnum.WORKOUT_RESULTS },
                        }),
                },
                {
                    label: 'Create Workout',
                    color: 'positive',
                    icon: addIcon,
                    handleClick: () => $q.dialog(WorkoutService.createDialogOptions()),
                },
            ]"
        />

        <PageHeading :headingIcon="workoutsPageIcon" :headingTitle="WorkoutService.labelPlural" />

        <q-list padding>
            <DashboardEmptyMessage
                v-if="liveRecords && liveRecords.length == 0 && subscriptionFinished"
                :title="`No Workouts Found`"
                :messages="[
                    'If this is your first time using the app, try creating a new Workout below.',
                    'Don\'t see an Workout that you created? Make sure it does not have the hidden status.',
                ]"
                buttonLabel="Create Workout"
                buttonColor="positive"
                @onEmptyAction="() => $q.dialog(WorkoutService.createDialogOptions())"
            />

            <q-item v-for="record in liveRecords" :key="record.id">
                <q-item-section>
                    <DashboardCard
                        :recordName="record?.name"
                        :recordDesc="record?.desc"
                        :recordLastChildCreatedAt="record?.lastChild?.createdAt"
                        :recordLastChildNote="record?.lastChild?.note"
                        :isLoading="$q.loading.isActive"
                        :hasLastChild="!!record?.lastChild"
                        :hasLockedStatus="record.status.includes(StatusEnum.LOCKED)"
                        :hasFavoriteStatus="record.status.includes(StatusEnum.FAVORITED)"
                        :supportsCharts="true"
                        :supportsInspect="true"
                        :supportsEdit="true"
                        :supportsDelete="true"
                        @onCharts="() => $q.dialog(WorkoutService.chartsDialogOptions(record.id))"
                        @onInspect="() => $q.dialog(WorkoutService.inspectDialogOptions(record.id))"
                        @onEdit="() => $q.dialog(WorkoutService.editDialogOptions(record.id))"
                        @onDelete="() => $q.dialog(WorkoutService.deleteDialogOptions(record.id))"
                        @onFavorite="
                            () => $q.dialog(WorkoutService.toggleFavoriteDialogOptions(record.id))
                        "
                        @onAddEntry="
                            () => $q.dialog(WorkoutResultService.createDialogOptions(record.id))
                        "
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </PageResponsive>
</template>
