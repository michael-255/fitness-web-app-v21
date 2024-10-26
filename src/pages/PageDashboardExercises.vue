<script setup lang="ts">
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Exercises Dashboard` })
</script>

<template>
    <ResponsivePage>
        <div>Exercises Dashboard</div>
    </ResponsivePage>
</template>
