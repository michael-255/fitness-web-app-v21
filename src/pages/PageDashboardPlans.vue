<script setup lang="ts">
import PageResponsive from '@/components/page/PageResponsive.vue'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Plans Dashboard` })
</script>

<template>
    <PageResponsive>
        <div>Plans Dashboard</div>
    </PageResponsive>
</template>
