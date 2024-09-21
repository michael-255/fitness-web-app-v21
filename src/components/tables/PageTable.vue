<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DB from '@/services/db'
import {
    addIcon,
    chartsIcon,
    closeIcon,
    deleteIcon,
    editIcon,
    filterIcon,
    inspectIcon,
    searchIcon,
} from '@/shared/icons'
import {
    columnOptionsFromTableColumns,
    recordsCount,
    visibleColumnsFromTableColumns,
} from '@/shared/utils'
import type { Observable } from 'dexie'
import type { QTableColumn } from 'quasar'
import { computed, onUnmounted, ref, type Ref } from 'vue'

const props = defineProps<{
    labelSingular: string
    labelPlural: string
    icon: string
    tableColumns: QTableColumn[]
    supportsColumnFilters?: boolean
    supportsTableCharts?: boolean
    supportsCharts?: boolean
    supportsInspect?: boolean
    supportsCreate?: boolean
    supportsEdit?: boolean
    supportsDelete?: boolean
    dataObservable: Observable
}>()

const emit = defineEmits<{
    (event: 'onTableCharts'): void
    (event: 'onCharts', id: string): void
    (event: 'onInspect', id: string): void
    (event: 'onCreate'): void
    (event: 'onEdit', id: string): void
    (event: 'onDelete', id: string): void
}>()

const { log } = useLogger(DB)
const { goBack } = useRouting(DB)

const searchFilter: Ref<string> = ref('')
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(props.tableColumns))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(props.tableColumns))
const liveRows: Ref<any[]> = ref([])

const subscription = props.dataObservable.subscribe({
    next: (records: any) => (liveRows.value = records),
    error: (error: Error) => log.error('Error loading live data', error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})

const supportsActions = computed(() => {
    return (
        props.supportsCharts || props.supportsInspect || props.supportsEdit || props.supportsDelete
    )
})
</script>

<template>
    <q-table
        fullscreen
        :rows="liveRows"
        :columns="tableColumns"
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
                        v-if="supportsCharts"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="cyan"
                        :icon="chartsIcon"
                        @click="emit('onCharts', props.cols[0].value)"
                    />
                    <q-btn
                        v-if="supportsInspect"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="primary"
                        :icon="inspectIcon"
                        @click="emit('onInspect', props.cols[0].value)"
                    />
                    <q-btn
                        v-if="supportsEdit"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="amber"
                        :icon="editIcon"
                        @click="emit('onEdit', props.cols[0].value)"
                    />
                    <q-btn
                        v-if="supportsDelete"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="negative"
                        :icon="deleteIcon"
                        @click="emit('onDelete', props.cols[0].value)"
                    />
                </q-td>
            </q-tr>
        </template>

        <template v-slot:top>
            <div class="row justify-start full-width q-mb-md">
                <div class="col-10 text-h6 text-bold ellipsis">
                    <q-icon class="q-pb-xs q-mr-xs" :name="icon" />
                    {{ labelPlural }}
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
                            v-if="supportsColumnFilters"
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
                                <q-icon color="white" :name="filterIcon" />
                            </template>
                        </q-select>

                        <q-btn
                            v-if="supportsCreate"
                            :icon="addIcon"
                            color="positive"
                            class="q-px-sm q-ml-xs"
                            @click="emit('onCreate')"
                        />
                        <q-btn
                            v-if="supportsTableCharts"
                            :disable="!liveRows.length"
                            :icon="chartsIcon"
                            color="cyan"
                            class="q-px-sm q-ml-xs"
                            @click="emit('onTableCharts')"
                        />
                    </template>

                    <template v-slot:append>
                        <q-icon :name="searchIcon" />
                    </template>
                </q-input>
            </div>
        </template>

        <template v-slot:bottom>
            {{ recordsCount(liveRows, labelSingular, labelPlural) }}
        </template>
    </q-table>
</template>
