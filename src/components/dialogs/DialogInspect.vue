<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import { closeIcon, inspectIcon } from '@/shared/icons'
import type { ComponentWithPropsType, IdType, ServiceType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { useDialogPluginComponent } from 'quasar'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
    id: IdType
    service: ServiceType
    inspectComponents: ComponentWithPropsType[]
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const { log } = useLogger()
const selectedStore = useSelectedStore()

onMounted(async () => {
    try {
        selectedStore.record = await props.service.get(props.id)
    } catch (error) {
        log.error('Error loading record', error as Error)
    }
})

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <q-dialog
        ref="dialogRef"
        transition-show="slide-up"
        transition-hide="slide-down"
        maximized
        @hide="onDialogHide"
    >
        <q-toolbar class="bg-info text-white toolbar-height">
            <q-icon :name="inspectIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Inspect {{ service.labelSingular }}</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list padding>
                            <component
                                v-for="(inspectComponent, index) in props.inspectComponents"
                                :key="index"
                                :is="inspectComponent.component"
                                v-bind="inspectComponent.props"
                            />
                        </q-list>
                        <div class="q-mt-xl" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.toolbar-height {
    max-height: 50px;
}
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
