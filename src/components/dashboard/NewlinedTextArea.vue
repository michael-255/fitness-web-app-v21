<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    text: string
}>()

const newlinedText = computed(() => {
    return props.text.split('\n')
})
</script>

<template>
    <div v-for="(line, index) in newlinedText" :key="index">{{ line }}<br /></div>
</template>
