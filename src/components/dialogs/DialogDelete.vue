<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'
import DialogConfirm from './DialogConfirm.vue'

/**
 * Based off of DialogConfirm. This dialog is a templateless component for deleting a record.
 */
const props = defineProps<{
    id: IdType
    labelSingular: string
    deleteMethod: (id: IdType) => Promise<Record<string, any>>
}>()

const $q = useQuasar()
const { log } = useLogger()

onMounted(() => {
    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: `Delete ${props.labelSingular} TEST`,
            message: `Are you sure you want to delete ${props.id}?`,
            color: 'negative',
            icon: deleteIcon,
            useConfirmationCode: 'ADVANCED-MODE-CONTROLLED',
        },
    }).onOk(async () => {
        try {
            $q.loading.show()
            const deletedRecord = await props.deleteMethod(props.id)
            log.info(`Deleted ${props.labelSingular}`, deletedRecord)
        } catch (error) {
            log.error(`Error deleting ${props.labelSingular}`, error as Error)
        } finally {
            $q.loading.hide()
        }
    })
})
</script>
