<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/shared/BaseFormItem.vue'
import { displayDateFormat, pickerDateFormat } from '@/shared/constants'
import { LimitEnum, TagEnum } from '@/shared/enums'
import {
    calendarCheckIcon,
    calendarIcon,
    cancelIcon,
    saveIcon,
    scheduleTimeIcon,
} from '@/shared/icons'
import { textAreaSchema, textLineSchema } from '@/shared/schemas'
import { computedTagToggle } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { date, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const isDisabled = computed(
    () => $q.loading.isActive || selectedStore.example.tags.includes(TagEnum.LOCKED),
)
const enabled = computedTagToggle(selectedStore.example.tags, TagEnum.ENABLED)
const favorited = computedTagToggle(selectedStore.example.tags, TagEnum.FAVORITED)

const displayDate = computed(
    () => date.formatDate(selectedStore.example.createdAt, displayDateFormat) ?? '-',
)
const dateTimePicker = ref(date.formatDate(selectedStore.example.createdAt, pickerDateFormat))

watch(
    () => selectedStore.example.createdAt,
    (newTimestamp) => {
        // Update the dateTimePicker with the new createdAt when the store changes
        dateTimePicker.value = date.formatDate(newTimestamp, pickerDateFormat)
    },
)

watch(dateTimePicker, () => {
    const newTimestamp = new Date(dateTimePicker.value).getTime()
    if (newTimestamp && !isNaN(newTimestamp)) {
        // Update the store with the new timestamp from the dateTimePicker
        selectedStore.example.createdAt = newTimestamp
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
                {{ selectedStore.example?.id ?? '-' }}
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
                    @click="selectedStore.example.createdAt = Date.now()"
                />
            </q-item-label>
        </BaseFormItem>

        <BaseFormItem label="Name" description="Customizable name for this record.">
            <q-item-label>
                <q-input
                    v-model="selectedStore.example.name"
                    @blur="selectedStore.example.name = selectedStore.example.name?.trim()"
                    :rules="[
                        (val: string) =>
                            textLineSchema.safeParse(val).success ||
                            `Name must be between ${LimitEnum.MIN_TEXT_LINE} and ${LimitEnum.MAX_TEXT_LINE} characters`,
                    ]"
                    :maxlength="LimitEnum.MAX_TEXT_LINE"
                    :disable="isDisabled"
                    type="text"
                    lazy-rules
                    counter
                    dense
                    outlined
                    color="primary"
                >
                    <template v-slot:append>
                        <q-icon
                            v-if="selectedStore.example.name !== ''"
                            @click="selectedStore.example.name = ''"
                            class="cursor-pointer"
                            :name="cancelIcon"
                        />
                    </template>
                </q-input>
            </q-item-label>
        </BaseFormItem>

        <BaseFormItem label="Description" description="Optional description for this record.">
            <q-item-label>
                <q-input
                    v-model="selectedStore.example.desc"
                    @blur="selectedStore.example.desc = selectedStore.example.desc?.trim()"
                    :rules="[
                        (val: string) =>
                            textAreaSchema.safeParse(val).success ||
                            `Description cannot exceed ${LimitEnum.MAX_TEXT_AREA} characters`,
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
                            v-if="selectedStore.example.desc !== ''"
                            @click="selectedStore.example.desc = ''"
                            class="cursor-pointer"
                            :name="cancelIcon"
                        />
                    </template>
                </q-input>
            </q-item-label>
        </BaseFormItem>

        <BaseFormItem
            label="Tags"
            description="Options that determine how the app treats this record in certain circumstances."
        >
            <q-item-label>
                <q-list padding>
                    <q-item :disable="isDisabled" tag="label">
                        <q-item-section top>
                            <q-item-label>Enabled</q-item-label>
                            <q-item-label caption> Record is active and visible. </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <q-toggle :disable="isDisabled" v-model="enabled" size="lg" />
                        </q-item-section>
                    </q-item>

                    <q-item :disable="isDisabled" tag="label">
                        <q-item-section top>
                            <q-item-label>Favorited</q-item-label>
                            <q-item-label caption> Record is given priority sorting. </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <q-toggle :disable="isDisabled" v-model="favorited" size="lg" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-item-label>
        </BaseFormItem>

        <q-item>
            <q-item-section>
                <q-item-label>
                    <div class="row justify-center">
                        <q-btn
                            label="Create Example"
                            :icon="saveIcon"
                            :disable="isDisabled"
                            color="positive"
                            type="submit"
                        />
                    </div>
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item v-show="!selectedStore.isExampleValid">
            <q-item-section>
                <div class="row justify-center text-warning">
                    Correct invalid form entries and try again
                </div>
            </q-item-section>
        </q-item>
    </q-list>
</template>
