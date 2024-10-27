<script setup lang="ts">
import PageResponsive from '@/components/page/PageResponsive.vue'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Workouts Dashboard` })
</script>

<template>
    <PageResponsive>
        <div>Workouts Dashboard</div>
    </PageResponsive>
</template>
