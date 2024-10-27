<script setup lang="ts">
/**
 * Page heading with icon, title, and a separator.
 * Always place this below the PageFabMenu component.
 */

defineProps<{
    headingIcon?: string
    headingTitle?: string
}>()
</script>

<template>
    <div class="text-h6 q-ma-md ellipsis">
        <q-icon class="on-left q-pb-xs" :name="headingIcon" />
        {{ headingTitle }}
    </div>

    <q-separator class="q-my-sm" />
</template>
