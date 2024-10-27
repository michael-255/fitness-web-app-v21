<script setup lang="ts">
import { topOfPageIcon } from '@/shared/icons'

/**
 * Responsive page with a page scroller. Additional bottom margin is added to the page content to
 * make more room for the scroller. Use the slot for your page content.
 */
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="responsive-container">
                <slot />
                <div class="q-mt-xl" />
            </div>
        </div>

        <q-page-scroller position="bottom">
            <q-btn fab glossy :icon="topOfPageIcon" color="accent" />
        </q-page-scroller>
    </q-page>
</template>

<style scoped>
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
