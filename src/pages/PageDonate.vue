<script setup lang="ts">
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { donatePageIcon, webIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Donate` })
</script>

<template>
    <ResponsivePage>
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
    </ResponsivePage>
</template>
