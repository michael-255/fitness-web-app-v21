<script setup lang="ts">
import ExampleResultService from '@/services/ExampleResultService'
import { chartsIcon, closeIcon } from '@/shared/icons'
import type { IdType, ServiceType } from '@/shared/types'
import { compactDateFromMs } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
    type ChartData,
    type ChartOptions,
    type TooltipItem,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { colors, useDialogPluginComponent } from 'quasar'
import { computed, onMounted, onUnmounted, ref, type ComputedRef, type Ref } from 'vue'
import { Line } from 'vue-chartjs'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LinearScale,
    PointElement,
    LineElement,
    CategoryScale,
    TimeScale,
)

const props = defineProps<{
    id: IdType
    service: ServiceType
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const selectedStore = useSelectedStore()

const hasRecords = ref(false)
const hasRecordsBeyondThreeMonths = ref(false)
const hasRecordsBeyondOneYear = ref(false)

const chartDatasetThreeMonths: Ref<{ x: any; y: any }[]> = ref([])
const chartDatasetOneYear: Ref<{ x: any; y: any }[]> = ref([])
const chartDatasetAllTime: Ref<{ x: any; y: any }[]> = ref([])

const chartOptionsThreeMonths: ChartOptions<'line'> = {
    responsive: true,
    aspectRatio: 1,
    elements: {
        point: {
            radius: 3,
        },
    },
    plugins: {
        title: {
            display: true,
            text: 'Mock Data - Last 3 Months',
            color: 'white',
            font: {
                size: 14,
            },
        },
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                title: (context: TooltipItem<'line'>[]) => {
                    return compactDateFromMs(context[0].parsed.x)
                },
                label: (context: TooltipItem<'line'>) => {
                    return `${context.parsed.y}`
                },
            },
        },
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'day',
            },
            adapters: {
                date: {
                    locale: enUS,
                },
            },
            ticks: {
                autoSkip: true,
                maxRotation: 60,
                minRotation: 60,
            },
        },
    },
}

const chartOptionsOneYear: ChartOptions<'line'> = {
    responsive: true,
    aspectRatio: 1,
    elements: {
        point: {
            radius: 3,
        },
    },
    plugins: {
        title: {
            display: true,
            text: 'Mock Data - Last Year',
            color: 'white',
            font: {
                size: 14,
            },
        },
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                title: (context: TooltipItem<'line'>[]) => {
                    return compactDateFromMs(context[0].parsed.x)
                },
                label: (context: TooltipItem<'line'>) => {
                    return `${context.parsed.y}`
                },
            },
        },
    },
    interaction: {
        intersect: false, // Tooltip triggers when mouse/touch position touches an item
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'month',
            },
            adapters: {
                date: {
                    locale: enUS,
                },
            },
            ticks: {
                autoSkip: true,
                maxRotation: 60,
                minRotation: 60,
            },
        },
    },
}

const chartOptionsAllTime: ChartOptions<'line'> = {
    responsive: true,
    aspectRatio: 1,
    elements: {
        point: {
            radius: 3,
        },
    },
    plugins: {
        title: {
            display: true,
            text: 'Mock Data - All Time',
            color: 'white',
            font: {
                size: 14,
            },
        },
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                title: (context: TooltipItem<'line'>[]) => {
                    return compactDateFromMs(context[0].parsed.x)
                },
                label: (context: TooltipItem<'line'>) => {
                    return `${context.parsed.y}`
                },
            },
        },
    },
    interaction: {
        intersect: false, // Tooltip triggers when mouse/touch position touches an item
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'year',
            },
            adapters: {
                date: {
                    locale: enUS,
                },
            },
            ticks: {
                autoSkip: true,
                maxRotation: 60,
                minRotation: 60,
            },
        },
    },
}

const chartDataThreeMonths: ComputedRef<ChartData<'line', { x: number; y: number }[]>> = computed(
    () => {
        return {
            datasets: [
                {
                    label: '',
                    data: chartDatasetThreeMonths.value,
                    borderColor: colors.getPaletteColor('primary'),
                    backgroundColor: colors.getPaletteColor('white'),
                },
            ],
        }
    },
)

const chartDataOneYear: ComputedRef<ChartData<'line', { x: number; y: number }[]>> = computed(
    () => {
        return {
            datasets: [
                {
                    label: '',
                    data: chartDatasetOneYear.value,
                    borderColor: colors.getPaletteColor('primary'),
                    backgroundColor: colors.getPaletteColor('white'),
                },
            ],
        }
    },
)

const chartDataAllTime: ComputedRef<ChartData<'line', { x: number; y: number }[]>> = computed(
    () => {
        return {
            datasets: [
                {
                    label: '',
                    data: chartDatasetAllTime.value,
                    borderColor: colors.getPaletteColor('primary'),
                    backgroundColor: colors.getPaletteColor('white'),
                },
            ],
        }
    },
)

onMounted(async () => {
    selectedStore.record = await props.service.get(props.id)

    const exampleResultDatasets = await ExampleResultService.getChartDatasets(
        selectedStore.record.id,
    )
    chartDatasetThreeMonths.value = exampleResultDatasets.threeMonths
    chartDatasetOneYear.value = exampleResultDatasets.oneYear
    chartDatasetAllTime.value = exampleResultDatasets.allTime
    hasRecords.value = exampleResultDatasets.hasRecords
    hasRecordsBeyondThreeMonths.value = exampleResultDatasets.hasRecordsBeyondThreeMonths
    hasRecordsBeyondOneYear.value = exampleResultDatasets.hasRecordsBeyondOneYear
})

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <q-dialog
        ref="dialogRef"
        transition-show="slide-up"
        transition-hide="slide-down"
        maximized
        @hide="onDialogHide"
    >
        <q-toolbar class="bg-info text-white toolbar-height">
            <q-icon :name="chartsIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Example Charts</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <Line
                    v-if="hasRecords"
                    :options="chartOptionsThreeMonths"
                    :data="chartDataThreeMonths"
                    style="max-height: 500px"
                />
                <div class="q-mt-xl" />

                <Line
                    v-if="hasRecordsBeyondThreeMonths"
                    :options="chartOptionsOneYear"
                    :data="chartDataOneYear"
                    style="max-height: 500px"
                />
                <div class="q-mt-xl" />

                <Line
                    v-if="hasRecordsBeyondOneYear"
                    :options="chartOptionsAllTime"
                    :data="chartDataAllTime"
                    style="max-height: 500px"
                />
                <div class="q-mt-xl" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.toolbar-height {
    max-height: 50px;
}
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
