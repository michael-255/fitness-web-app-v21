<script setup lang="ts">
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Measurements Dashboard` })
</script>

<template>
    <ResponsivePage>
        <div>Measurements Dashboard</div>
    </ResponsivePage>
</template>
