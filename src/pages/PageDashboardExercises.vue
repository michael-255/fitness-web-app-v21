<script setup lang="ts">
import PageResponsive from '@/components/page/PageResponsive.vue'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Exercises Dashboard` })
</script>

<template>
    <PageResponsive>
        <div>Exercises Dashboard</div>
    </PageResponsive>
</template>
