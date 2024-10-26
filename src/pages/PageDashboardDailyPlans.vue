<script setup lang="ts">
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Daily Plans Dashboard` })
</script>

<template>
    <ResponsivePage>
        <div>Daily Plans Dashboard</div>
    </ResponsivePage>
</template>
