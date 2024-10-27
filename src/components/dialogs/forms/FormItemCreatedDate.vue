<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/forms/BaseFormItem.vue'
import { displayDateFormat, pickerDateFormat } from '@/shared/constants'
import { calendarCheckIcon, calendarIcon, scheduleTimeIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import { date, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const isDisabled = computed(() => $q.loading.isActive || selectedStore.lockedStatus)
const displayDate = computed(
    () => date.formatDate(selectedStore.record.createdAt, displayDateFormat) ?? '-',
)
const dateTimePicker = ref(date.formatDate(selectedStore.record.createdAt, pickerDateFormat))

watch(
    () => selectedStore.record.createdAt,
    (newTimestamp) => {
        // Update the dateTimePicker with the new createdAt when the store changes
        dateTimePicker.value = date.formatDate(newTimestamp, pickerDateFormat)
    },
)

watch(dateTimePicker, () => {
    const newTimestamp = new Date(dateTimePicker.value).getTime()
    if (newTimestamp && !isNaN(newTimestamp)) {
        // Update the store with the new timestamp from the dateTimePicker
        selectedStore.record.createdAt = newTimestamp
    }
})
</script>

<template>
    <BaseFormItem label="Created Date" description="Date and time this record was created.">
        <q-item-label class="text-h6">{{ displayDate }}</q-item-label>

        <q-item-label class="q-gutter-xs">
            <q-btn
                :disable="isDisabled"
                :icon="calendarIcon"
                size="sm"
                label="Date"
                color="primary"
            >
                <q-popup-proxy>
                    <q-date
                        v-model="dateTimePicker"
                        mask="ddd MMM DD YYYY HH:mm:00"
                        today-btn
                        no-unset
                    >
                        <q-btn label="Close" flat class="full-width" v-close-popup />
                    </q-date>
                </q-popup-proxy>
            </q-btn>

            <q-btn
                :disable="isDisabled"
                :icon="scheduleTimeIcon"
                size="sm"
                label="Time"
                color="primary"
            >
                <q-popup-proxy>
                    <q-time v-model="dateTimePicker" mask="ddd MMM DD YYYY HH:mm:00">
                        <q-btn label="Close" flat class="full-width" v-close-popup />
                    </q-time>
                </q-popup-proxy>
            </q-btn>

            <q-btn
                :disable="isDisabled"
                :icon="calendarCheckIcon"
                size="sm"
                label="Now"
                color="positive"
                @click="selectedStore.record.createdAt = Date.now()"
            />
        </q-item-label>
    </BaseFormItem>
</template>
