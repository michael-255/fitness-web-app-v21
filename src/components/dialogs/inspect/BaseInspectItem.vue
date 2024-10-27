<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ label }}</q-item-label>

            <q-item-label caption>
                <slot />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
