<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import { appName } from '@/shared/constants'
import { StatusEnum } from '@/shared/enums'
import {
    addIcon,
    chartsIcon,
    closeIcon,
    columnsIcon,
    deleteIcon,
    editIcon,
    inspectIcon,
    searchIcon,
} from '@/shared/icons'
import type { StatusType } from '@/shared/types'
import {
    columnOptionsFromTableColumns,
    recordsCount,
    visibleColumnsFromTableColumns,
} from '@/shared/utils'
import { useMeta, type QTableColumn } from 'quasar'
import { computed, onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Data Table` })

const { log } = useLogger()
const { routeService, goBack } = useRouting()

const searchFilter: Ref<string> = ref('')
const columnOptions: Ref<QTableColumn[]> = ref(
    columnOptionsFromTableColumns(routeService.tableColumns),
)
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(routeService.tableColumns))
const liveRows: Ref<Record<string, any>[]> = ref([])

const subscription = routeService.liveTable().subscribe({
    next: (records: Record<string, any>[]) => (liveRows.value = records),
    error: (error: Error) =>
        log.error(`Error loading live ${routeService.labelPlural} data`, error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})

const supportsActions = computed(() => {
    return (
        routeService.supportsCharts ||
        routeService.supportsInspect ||
        routeService.supportsEdit ||
        routeService.supportsDelete
    )
})

function isRowLocked(row: { status?: StatusType[] }) {
    return row?.status?.includes(StatusEnum.LOCKED) || false
}

function hasNoChildData(row: { lastChild?: any }) {
    return !row?.lastChild
}
</script>

<template>
    <q-table
        fullscreen
        :rows="liveRows"
        :columns="routeService.tableColumns"
        :visible-columns="visibleColumns"
        :rows-per-page-options="[0]"
        :filter="searchFilter"
        virtual-scroll
        row-key="id"
    >
        <template v-slot:header="props">
            <q-tr :props="props">
                <q-th
                    v-for="col in props.cols"
                    v-show="col.name !== 'hidden'"
                    :key="col.name"
                    :props="props"
                >
                    {{ col.label }}
                </q-th>
                <q-th v-if="supportsActions" auto-width class="text-left">Actions</q-th>
            </q-tr>
        </template>

        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                </q-td>
                <q-td v-if="supportsActions" auto-width>
                    <q-btn
                        v-if="routeService.supportsCharts"
                        :disable="hasNoChildData(props.row)"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        :color="hasNoChildData(props.row) ? 'grey' : 'cyan'"
                        :icon="chartsIcon"
                        @click="
                            () => $q.dialog(routeService.chartsDialogOptions(props.cols[0].value))
                        "
                    />
                    <q-btn
                        v-if="routeService.supportsInspect"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="primary"
                        :icon="inspectIcon"
                        @click="
                            () => $q.dialog(routeService.inspectDialogOptions(props.cols[0].value))
                        "
                    />
                    <q-btn
                        v-if="routeService.supportsEdit"
                        :disable="isRowLocked(props.row)"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        :icon="editIcon"
                        :color="isRowLocked(props.row) ? 'grey' : 'amber'"
                        @click="
                            () => $q.dialog(routeService.editDialogOptions(props.cols[0].value))
                        "
                    />
                    <q-btn
                        v-if="routeService.supportsDelete"
                        :disable="isRowLocked(props.row)"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        :color="isRowLocked(props.row) ? 'grey' : 'negative'"
                        :icon="deleteIcon"
                        @click="
                            () => $q.dialog(routeService.deleteDialogOptions(props.cols[0].value))
                        "
                    />
                </q-td>
            </q-tr>
        </template>

        <template v-slot:top>
            <div class="row justify-start full-width q-mb-md">
                <div class="col-10 text-h6 text-bold ellipsis">
                    <q-icon class="q-pb-xs q-mr-xs" :name="routeService.tableIcon" />
                    {{ routeService.labelPlural }}
                </div>

                <q-btn
                    round
                    flat
                    class="absolute-top-right q-mr-sm q-mt-sm"
                    :icon="closeIcon"
                    @click="goBack"
                />
            </div>

            <div class="row justify-start full-width">
                <q-input
                    :disable="!liveRows.length"
                    outlined
                    dense
                    clearable
                    debounce="300"
                    v-model="searchFilter"
                    placeholder="Search"
                    class="full-width"
                >
                    <template v-slot:after>
                        <q-select
                            v-if="routeService.supportsTableColumnFilters"
                            v-model="visibleColumns"
                            :options="columnOptions"
                            :disable="!liveRows.length"
                            multiple
                            dense
                            options-dense
                            emit-value
                            map-options
                            option-value="name"
                            display-value=""
                            bg-color="primary"
                        >
                            <template v-slot:append>
                                <q-icon color="white" :name="columnsIcon" />
                            </template>
                        </q-select>

                        <q-btn
                            v-if="routeService.supportsActivityCharts"
                            :disable="!liveRows.length"
                            :icon="chartsIcon"
                            color="cyan"
                            class="q-px-sm q-ml-xs"
                            @click="() => $q.dialog(routeService.activityChartsDialogOptions())"
                        />
                        <q-btn
                            v-if="routeService.supportsCreate"
                            :icon="addIcon"
                            color="positive"
                            class="q-px-sm q-ml-xs"
                            @click="() => $q.dialog(routeService.createDialogOptions())"
                        />
                    </template>

                    <template v-slot:append>
                        <q-icon :name="searchIcon" />
                    </template>
                </q-input>
            </div>
        </template>

        <template v-slot:bottom>
            {{ recordsCount(liveRows, routeService.labelSingular, routeService.labelPlural) }}
        </template>
    </q-table>
</template>
