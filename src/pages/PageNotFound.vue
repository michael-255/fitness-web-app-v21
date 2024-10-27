<script setup lang="ts">
import PageFabMenu from '@/components/page/PageFabMenu.vue'
import PageHeading from '@/components/page/PageHeading.vue'
import PageResponsive from '@/components/page/PageResponsive.vue'
import { appName } from '@/shared/constants'
import { warnIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - 404 Not Found` })
</script>

<template>
    <PageResponsive>
        <PageFabMenu />
        <PageHeading :headingIcon="warnIcon" headingTitle="404" />
        <div class="q-mt-md q-ml-md text-h5">Page Not Found</div>
    </PageResponsive>
</template>
