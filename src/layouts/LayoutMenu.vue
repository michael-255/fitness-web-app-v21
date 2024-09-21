<script setup lang="ts">
import { RouteNameEnum } from '@/shared/enums'
import { examplesPageIcon, settingsPageIcon } from '@/shared/icons'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { RouterView } from 'vue-router'

const $q = useQuasar()
const isDesktop = computed(() => $q.screen.gt.xs)
</script>

<template>
    <q-layout view="hHh lpr lfr">
        <q-header bordered>
            <q-tabs class="text-caption" active-color="yellow" outside-arrows mobile-arrows>
                <q-route-tab
                    no-caps
                    :icon="examplesPageIcon"
                    exact
                    :to="{ name: RouteNameEnum.DASHBOARD }"
                >
                    <template v-if="isDesktop">Examples</template>
                </q-route-tab>

                <q-route-tab
                    no-caps
                    :icon="settingsPageIcon"
                    exact
                    :to="{ name: RouteNameEnum.SETTINGS }"
                >
                    <template v-if="isDesktop">Settings</template>
                </q-route-tab>
            </q-tabs>
        </q-header>

        <q-page-container>
            <RouterView />
        </q-page-container>
    </q-layout>
</template>
