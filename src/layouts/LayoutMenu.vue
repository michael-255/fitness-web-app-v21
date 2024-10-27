<script setup lang="ts">
import { RouteNameEnum } from '@/shared/enums'
import {
    calendarCheckIcon,
    exercisesPageIcon,
    measurementsPageIcon,
    settingsPageIcon,
    workoutsPageIcon,
} from '@/shared/icons'
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
                    :icon="calendarCheckIcon"
                    exact
                    :to="{ name: RouteNameEnum.PLANS_DASHBOARD }"
                >
                    <template v-if="isDesktop">Plans</template>
                </q-route-tab>

                <q-route-tab
                    no-caps
                    :icon="workoutsPageIcon"
                    exact
                    :to="{ name: RouteNameEnum.WORKOUTS_DASHBOARD }"
                >
                    <template v-if="isDesktop">Workouts</template>
                </q-route-tab>

                <q-route-tab
                    no-caps
                    :icon="exercisesPageIcon"
                    exact
                    :to="{ name: RouteNameEnum.EXERCISES_DASHBOARD }"
                >
                    <template v-if="isDesktop">Exercises</template>
                </q-route-tab>

                <q-route-tab
                    no-caps
                    :icon="measurementsPageIcon"
                    exact
                    :to="{ name: RouteNameEnum.MEASUREMENTS_DASHBOARD }"
                >
                    <template v-if="isDesktop">Measurements</template>
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
