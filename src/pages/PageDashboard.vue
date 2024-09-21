<script setup lang="ts">
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardEmptyMessage from '@/components/dashboard/DashboardEmptyMessage.vue'
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useExampleDialogs from '@/composables/useExampleDialogs'
import useExampleResultDialogs from '@/composables/useExampleResultDialogs'
import useLogger from '@/composables/useLogger'
import ExamplesService from '@/services/ExamplesService'
import { appName } from '@/shared/constants'
import { RouteNameEnum, TagEnum } from '@/shared/enums'
import { addIcon, databaseIcon, examplesPageIcon } from '@/shared/icons'
import type { ExampleType } from '@/shared/types'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Dashboard` })

const $q = useQuasar()
const router = useRouter()
const { log } = useLogger()
const {
    toggleFavoriteExampleDialog,
    chartExampleDialog,
    inspectExampleDialog,
    createExampleDialog,
    editExampleDialog,
    deleteExampleDialog,
} = useExampleDialogs()
const { createExampleResultDialog } = useExampleResultDialogs()
const examplesService = ExamplesService()

const subscriptionFinished = ref(false)
const liveExamples: Ref<ExampleType[]> = ref([])
const subscription = examplesService.liveDashboardObservable().subscribe({
    next: (examples) => {
        liveExamples.value = examples
        subscriptionFinished.value = true
    },
    error: (error) => {
        log.error('Error loading live Examples data', error as Error)
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
                    label: 'Examples Data',
                    color: 'primary',
                    icon: databaseIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.EXAMPLES_TABLE }),
                },
                {
                    label: 'Example Results Data',
                    color: 'warning',
                    icon: databaseIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.EXAMPLE_RESULTS_TABLE }),
                },
                {
                    label: 'Create Example',
                    color: 'positive',
                    icon: addIcon,
                    handleClick: createExampleDialog,
                },
            ]"
        />

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list padding>
            <DashboardEmptyMessage
                v-if="liveExamples && liveExamples.length == 0 && subscriptionFinished"
                :title="`No Enabled Examples Found`"
                :messages="[
                    'If this is your first time using the app, try creating a new example below.',
                    'Don\'t see an Example that you created? Make sure it is enabled.',
                ]"
                buttonLabel="Create Example"
                buttonColor="positive"
                @onEmptyAction="createExampleDialog"
            />

            <q-item v-for="example in liveExamples" :key="example.id">
                <q-item-section>
                    <DashboardCard
                        :recordName="example?.name"
                        :recordDesc="example?.desc"
                        :recordLastChildCreatedAt="example?.lastChild?.createdAt"
                        :recordLastChildNote="example?.lastChild?.note"
                        :isLoading="$q.loading.isActive"
                        :hasLastChild="!!example?.lastChild"
                        :hasLockedTag="example.tags.includes(TagEnum.LOCKED)"
                        :hasFavoriteTag="example.tags.includes(TagEnum.FAVORITED)"
                        :supportsCharts="true"
                        :supportsInspect="true"
                        :supportsEdit="true"
                        :supportsDelete="true"
                        @onCharts="chartExampleDialog(example.id)"
                        @onInspect="inspectExampleDialog(example.id)"
                        @onEdit="editExampleDialog(example.id)"
                        @onDelete="deleteExampleDialog(example.id)"
                        @onFavorite="toggleFavoriteExampleDialog(example)"
                        @onAddEntry="createExampleResultDialog(example.id)"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
