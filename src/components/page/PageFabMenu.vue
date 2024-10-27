<script setup lang="ts">
import useRouting from '@/composables/useRouting'
import { backIcon, downIcon } from '@/shared/icons'
import useSettingsStore from '@/stores/settings'

/**
 * FAB menu for the top right corner of screen. This should be the first component in the q-page.
 * The positioning classes are important to make sure the menu does not move when scrolling and is
 * always visible in the same spot on every page.
 *
 * Omitting the subButtons prop will show the got back button instead.
 */
defineProps<{
    isLoading?: boolean
    subButtons?: {
        label: string
        color: string
        icon: string
        handleClick: () => void
    }[]
}>()

const { goBack } = useRouting()
const settingsStore = useSettingsStore()
</script>

<template>
    <q-fab
        v-if="subButtons && subButtons.length > 0"
        :disable="isLoading"
        :icon="downIcon"
        class="floating-fab-menu q-mr-sm"
        glossy
        color="accent"
        direction="down"
        vertical-actions-align="right"
    >
        <q-fab-action
            v-for="(button, i) in subButtons"
            :key="i"
            :disable="isLoading"
            :label="settingsStore.advancedMode ? '' : button.label"
            :color="button.color"
            :icon="button.icon"
            @click="button.handleClick"
            label-position="left"
            glossy
        />
    </q-fab>

    <q-btn
        v-else
        :disable="isLoading"
        :icon="backIcon"
        class="floating-fab-menu q-mr-sm"
        glossy
        fab
        color="accent"
        @click="goBack()"
    />
</template>

<style scoped>
.floating-fab-menu {
    position: sticky;
    float: right;
    top: 84px;
    transform: translateY(-25px) translateX(8px);
}
</style>
