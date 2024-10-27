<script setup lang="ts">
import PageResponsive from '@/components/page/PageResponsive.vue'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Daily Plans Dashboard` })
</script>

<template>
    <PageResponsive>
        <div>Daily Plans Dashboard</div>
    </PageResponsive>
</template>
