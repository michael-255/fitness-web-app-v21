<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/forms/BaseFormItem.vue'
import { LimitEnum } from '@/shared/enums'
import { cancelIcon } from '@/shared/icons'
import { textAreaSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const isDisabled = computed(() => $q.loading.isActive || selectedStore.lockedStatus)
</script>

<template>
    <BaseFormItem label="Note" description="Optional description for this record.">
        <q-item-label>
            <q-input
                v-model="selectedStore.record.note"
                @blur="selectedStore.record.note = selectedStore.record.note?.trim()"
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
                        v-if="selectedStore.record.note !== ''"
                        @click="selectedStore.record.note = ''"
                        class="cursor-pointer"
                        :name="cancelIcon"
                    />
                </template>
            </q-input>
        </q-item-label>
    </BaseFormItem>
</template>
