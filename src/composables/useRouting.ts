import useLogger from '@/composables/useLogger'
import DB, { Database } from '@/services/db'
import { useRouter } from 'vue-router'

export default function useRouting(db: Database = DB) {
    // Do NOT return route or router from any composable due to performance issues
    const router = useRouter()
    const { log } = useLogger(db)

    /**
     * Go back if previous route state is part of the app history, otherwise go to root path.
     */
    function goBack() {
        try {
            if (router?.options?.history?.state?.back) {
                router.back()
            } else {
                router.push('/')
            }
        } catch (error) {
            log.error('Error accessing previous route', error as Error)
        }
    }

    return {
        goBack,
    }
}