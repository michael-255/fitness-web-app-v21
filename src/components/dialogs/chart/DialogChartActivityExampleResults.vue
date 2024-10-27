<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import type { ExampleResultType } from '@/models/ExampleResult'
import ExampleResultService from '@/services/ExampleResultService'
import { chartsIcon, closeIcon } from '@/shared/icons'
import { compactDateFromMs } from '@/shared/utils'
import {
    Chart as ChartJS,
    Legend,
    LinearScale,
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
import { computed, onUnmounted, ref, type ComputedRef, type Ref } from 'vue'
import { Scatter } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement, TimeScale)

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const { log } = useLogger()

const subscriptionFinished = ref(false)
const liveRecords: Ref<ExampleResultType[]> = ref([])
const hasRecords = ref(false)

const subscription = ExampleResultService.liveTable().subscribe({
    next: (records) => {
        liveRecords.value = records
        subscriptionFinished.value = true
        if (liveRecords.value.length > 0) {
            hasRecords.value = true
        } else {
            hasRecords.value = false
        }
    },
    error: (error) => {
        log.error(`Error loading live ${ExampleResultService.labelPlural} data`, error as Error)
        subscriptionFinished.value = true
        hasRecords.value = false
    },
})

const chartOptions: ChartOptions<'scatter'> = {
    responsive: true,
    aspectRatio: 1,
    elements: {
        point: {
            radius: 4,
        },
    },
    plugins: {
        title: {
            display: true,
            text: `${ExampleResultService.labelSingular} Activity - Last 3 Months`,
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
                label: (context: TooltipItem<'scatter'>) => {
                    return compactDateFromMs(context.parsed.x)
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
        y: {
            type: 'linear',
            min: 0,
            max: 86400, // Number of seconds in a day
            ticks: {
                stepSize: 21600, // One hour in seconds
                callback: function (value: number | string) {
                    const seconds = Number(value)
                    if (seconds === 0) return 'Morning'
                    if (seconds === 21600) return '6 AM'
                    if (seconds === 43200) return 'Noon'
                    if (seconds === 64800) return '6 PM'
                    if (seconds === 86400) return 'Evening'
                },
            },
        },
    },
}

const chartData: ComputedRef<ChartData<'scatter', { x: number; y: number }[]>> = computed(() => {
    return {
        datasets: [
            {
                label: ExampleResultService.labelPlural,
                backgroundColor: colors.getPaletteColor('primary'),
                data: liveRecords.value.map((record) => ({
                    x: record.createdAt,
                    y: getTimeOfDay(record.createdAt),
                })),
            },
        ],
    }
})

onUnmounted(() => {
    subscription.unsubscribe()
})

/**
 * Get the time of day in seconds from a given time in milliseconds. This is used to display the
 * time of day on the Y-axis.
 */
function getTimeOfDay(time: number) {
    return (
        new Date(time).getHours() * 3600 +
        new Date(time).getMinutes() * 60 +
        new Date(time).getSeconds()
    )
}
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
            <q-toolbar-title>Activity Charts</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <Scatter
                    v-if="hasRecords"
                    :options="chartOptions"
                    :data="chartData"
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
</style>
