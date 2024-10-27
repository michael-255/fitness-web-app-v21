<script setup lang="ts">
import PageResponsive from '@/components/page/PageResponsive.vue'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Measurements Dashboard` })
</script>

<template>
    <PageResponsive>
        <div>Measurements Dashboard</div>
    </PageResponsive>
</template>
