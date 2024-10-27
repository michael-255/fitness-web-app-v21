<script setup lang="ts">
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardEmptyMessage from '@/components/dashboard/DashboardEmptyMessage.vue'
import PageFabMenu from '@/components/page/PageFabMenu.vue'
import PageHeading from '@/components/page/PageHeading.vue'
import PageResponsive from '@/components/page/PageResponsive.vue'
import useLogger from '@/composables/useLogger'
import type { ExerciseType } from '@/models/Exercise'
import ExerciseResultService from '@/services/ExerciseResultService'
import ExerciseService from '@/services/ExerciseService'
import { appName } from '@/shared/constants'
import { RouteNameEnum, StatusEnum, TableEnum } from '@/shared/enums'
import { addIcon, databaseIcon, exercisesPageIcon } from '@/shared/icons'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Exercises Dashboard` })

const $q = useQuasar()
const router = useRouter()
const { log } = useLogger()

const subscriptionFinished = ref(false)
const liveRecords: Ref<ExerciseType[]> = ref([])
const subscription = ExerciseService.liveDashboard().subscribe({
    next: (records) => {
        liveRecords.value = records
        subscriptionFinished.value = true
    },
    error: (error) => {
        log.error(`Error loading live ${ExerciseService.labelPlural} data`, error as Error)
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
                    label: 'Exercises Data',
                    color: 'primary',
                    icon: exercisesPageIcon,
                    handleClick: () =>
                        router.push({
                            name: RouteNameEnum.TABLE,
                            params: { table: TableEnum.EXERCISES },
                        }),
                },
                {
                    label: 'Exercise Results Data',
                    color: 'primary',
                    icon: databaseIcon,
                    handleClick: () =>
                        router.push({
                            name: RouteNameEnum.TABLE,
                            params: { table: TableEnum.EXERCISE_RESULTS },
                        }),
                },
                {
                    label: 'Create Exercise',
                    color: 'positive',
                    icon: addIcon,
                    handleClick: () => $q.dialog(ExerciseService.createDialogOptions()),
                },
            ]"
        />

        <PageHeading :headingIcon="exercisesPageIcon" :headingTitle="ExerciseService.labelPlural" />

        <q-list padding>
            <DashboardEmptyMessage
                v-if="liveRecords && liveRecords.length == 0 && subscriptionFinished"
                :title="`No Exercises Found`"
                :messages="[
                    'If this is your first time using the app, try creating a new Exercise below.',
                    'Don\'t see an Exercise that you created? Make sure it does not have the hidden status.',
                ]"
                buttonLabel="Create Exercise"
                buttonColor="positive"
                @onEmptyAction="() => $q.dialog(ExerciseService.createDialogOptions())"
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
                        @onCharts="() => $q.dialog(ExerciseService.chartsDialogOptions(record.id))"
                        @onInspect="
                            () => $q.dialog(ExerciseService.inspectDialogOptions(record.id))
                        "
                        @onEdit="() => $q.dialog(ExerciseService.editDialogOptions(record.id))"
                        @onDelete="() => $q.dialog(ExerciseService.deleteDialogOptions(record.id))"
                        @onFavorite="
                            () => $q.dialog(ExerciseService.toggleFavoriteDialogOptions(record.id))
                        "
                        @onAddEntry="
                            () => $q.dialog(ExerciseResultService.createDialogOptions(record.id))
                        "
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </PageResponsive>
</template>
