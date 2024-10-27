<script setup lang="ts">
import PageFabMenu from '@/components/page/PageFabMenu.vue'
import PageHeading from '@/components/page/PageHeading.vue'
import PageResponsive from '@/components/page/PageResponsive.vue'
import { appName } from '@/shared/constants'
import { donatePageIcon, webIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Donate` })
</script>

<template>
    <PageResponsive>
        <PageFabMenu />
        <PageHeading :headingIcon="donatePageIcon" headingTitle="Donate" />

        <q-list padding>
            <q-item>
                <q-item-section>
                    <q-item-label>
                        Hope you enjoyed using {{ appName }}. I try to create and maintain projects
                        that people find useful. Please consider donating to help me out. Thank you!
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-item-label>
                        Donations are done through <strong>Ko-fi</strong>. It's safe, easy to use,
                        and doesn't require an account.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-btn
                        class="full-width"
                        color="pink"
                        label="Support me on Ko-fi"
                        target="_blank"
                        href="https://ko-fi.com/michael255"
                        :icon="webIcon"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </PageResponsive>
</template>
