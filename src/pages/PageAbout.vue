<script setup lang="ts">
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appDescription, appName } from '@/shared/constants'
import { codeIcon, donatePageIcon, infoIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - About` })
</script>

<template>
    <ResponsivePage>
        <PageFabMenu />

        <PageHeading :headingIcon="infoIcon" headingTitle="About" />

        <q-list padding>
            <q-item>
                <q-item-section>
                    <q-item-label>
                        {{ appDescription }}
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-item-label>
                        Feel free to checkout my other projects or help support my work with a
                        donation. Thanks for visiting!
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-btn
                        class="full-width"
                        color="primary"
                        label="GitHub"
                        target="_blank"
                        href="https://github.com/michael-255"
                        :icon="codeIcon"
                    />
                </q-item-section>

                <q-item-section>
                    <q-btn
                        class="full-width"
                        color="pink"
                        label="Donate"
                        to="/donate"
                        :icon="donatePageIcon"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
