<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/forms/BaseFormItem.vue'
import useSelectedStore from '@/stores/selected'

const selectedStore = useSelectedStore()
</script>

<template>
    <BaseFormItem
        label="Id"
        description="An auto generated value that uniquely identifies this record."
    >
        <q-item-label caption>
            {{ selectedStore.record.id ?? '-' }}
        </q-item-label>
    </BaseFormItem>
</template>
