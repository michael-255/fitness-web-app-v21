<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/shared/BaseFormItem.vue'
import useLogger from '@/composables/useLogger'
import ExerciseService from '@/services/ExerciseService'
import { displayDateFormat, pickerDateFormat } from '@/shared/constants'
import { LimitEnum, StatusEnum } from '@/shared/enums'
import {
    calendarCheckIcon,
    calendarIcon,
    cancelIcon,
    saveIcon,
    scheduleTimeIcon,
} from '@/shared/icons'
import { idSchema, textAreaSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import { date, useQuasar } from 'quasar'
import { computed, onMounted, ref, watch, type Ref } from 'vue'

const $q = useQuasar()
const { log } = useLogger()
const selectedStore = useSelectedStore()

const isDisabled = computed(
    () => $q.loading.isActive || selectedStore.exerciseResult.status.includes(StatusEnum.LOCKED),
)

const displayDate = computed(
    () => date.formatDate(selectedStore.exerciseResult.createdAt, displayDateFormat) ?? '-',
)
const dateTimePicker = ref(
    date.formatDate(selectedStore.exerciseResult.createdAt, pickerDateFormat),
)

const options: Ref<{ value: string; label: string; disable: boolean }[]> = ref([])

onMounted(async () => {
    try {
        // Get Parent record options for the child record to select
        options.value = await ExerciseService.getSelectOptions()
        // Check if the selected exerciseId is in the options
        const exerciseIdMatch = options.value.some(
            (i) => i.value === selectedStore.exerciseResult.exerciseId,
        )

        if (!exerciseIdMatch) {
            selectedStore.exerciseResult.exerciseId = undefined! // If no options, or id is invalid
        }
    } catch (error) {
        log.error('Error loading Parent Exercise Id options', error as Error)
    }
})

watch(
    () => selectedStore.exerciseResult.createdAt,
    (newTimestamp) => {
        // Update the dateTimePicker with the new createdAt when the store changes
        dateTimePicker.value = date.formatDate(newTimestamp, pickerDateFormat)
    },
)

watch(dateTimePicker, () => {
    const newTimestamp = new Date(dateTimePicker.value).getTime()
    if (newTimestamp && !isNaN(newTimestamp)) {
        // Update the store with the new timestamp from the dateTimePicker
        selectedStore.exerciseResult.createdAt = newTimestamp
    }
})
</script>

<template>
    <q-list padding>
        <BaseFormItem
            label="Id"
            description="An auto generated value that uniquely identifies this record in the database."
        >
            <q-item-label caption>
                {{ selectedStore.exerciseResult?.id ?? '-' }}
            </q-item-label>
        </BaseFormItem>

        <BaseFormItem
            label="Parent Exercise Id"
            description="Id of the parent record that this child record is associated with."
        >
            <q-item-label caption>
                <q-select
                    v-model="selectedStore.exerciseResult.exerciseId"
                    :rules="[(val: string) => idSchema.safeParse(val).success || 'Required']"
                    :disable="isDisabled"
                    :options="options"
                    lazy-rules
                    emit-value
                    map-options
                    options-dense
                    dense
                    outlined
                    color="primary"
                />
            </q-item-label>
        </BaseFormItem>

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
                        <q-time v-model="dateTimePicker" mask="ddd MMM DD YYYY HH:mm:00" now-btn>
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
                    @click="selectedStore.exerciseResult.createdAt = Date.now()"
                />
            </q-item-label>
        </BaseFormItem>

        <BaseFormItem label="Note" description="Optional description for this record.">
            <q-item-label>
                <q-input
                    v-model="selectedStore.exerciseResult.note"
                    @blur="
                        selectedStore.exerciseResult.note =
                            selectedStore.exerciseResult.note?.trim()
                    "
                    :rules="[
                        (val: string) =>
                            textAreaSchema.safeParse(val).success ||
                            `Note cannot exceed ${LimitEnum.MAX_TEXT_AREA} characters`,
                    ]"
                    :maxlength="LimitEnum.MAX_TEXT_AREA"
                    :disable="isDisabled"
                    type="textarea"
                    lazy-rules
                    autogrow
                    counter
                    dense
                    outlined
                    color="primary"
                >
                    <template v-slot:append>
                        <q-icon
                            v-if="selectedStore.exerciseResult.note !== ''"
                            @click="selectedStore.exerciseResult.note = ''"
                            class="cursor-pointer"
                            :name="cancelIcon"
                        />
                    </template>
                </q-input>
            </q-item-label>
        </BaseFormItem>

        <q-item>
            <q-item-section>
                <q-item-label>
                    <div class="row justify-center">
                        <q-btn
                            label="Create Exercise Result"
                            :icon="saveIcon"
                            :disable="isDisabled"
                            color="positive"
                            type="submit"
                        />
                    </div>
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item v-show="!selectedStore.isExerciseResultValid">
            <q-item-section>
                <div class="row justify-center text-warning">
                    Correct invalid form entries and try again
                </div>
            </q-item-section>
        </q-item>
    </q-list>
</template>
