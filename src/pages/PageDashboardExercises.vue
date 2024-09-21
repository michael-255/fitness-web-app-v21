<script setup lang="ts">
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { warnIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - INDEV` })
</script>

<template>
    <ResponsivePage>
        <PageFabMenu />
        <PageHeading :headingIcon="warnIcon" headingTitle="Exercises" />
        <div class="q-mt-md q-ml-md text-h5">In Development</div>
    </ResponsivePage>
</template>
