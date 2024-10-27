import useLogger from '@/composables/useLogger'
import DailyPlanService from '@/services/DailyPlanService'
import ExerciseResultService from '@/services/ExerciseResultService'
import ExerciseService from '@/services/ExerciseService'
import LogService from '@/services/LogService'
import MeasurementService from '@/services/MeasurementService'
import SettingService from '@/services/SettingService'
import WorkoutResultService from '@/services/WorkoutResultService'
import WorkoutService from '@/services/WorkoutService'
import { RouteNameEnum, TableEnum } from '@/shared/enums'
import type { ServiceType } from '@/shared/types'
// import type { ServiceType } from '@/shared/types'
import { useRoute, useRouter } from 'vue-router'

export default function useRouting() {
    // Do NOT return route or router from any composable due to performance issues
    const route = useRoute()
    const router = useRouter()
    const { log } = useLogger()

    // Current table used by the route is any
    const routeTable = Array.isArray(route.params.table)
        ? route.params.table[0]
        : route.params.table

    // Service associated with the current route table if any
    let routeService: ServiceType = null!

    switch (routeTable) {
        case TableEnum.SETTINGS:
            routeService = SettingService
            break
        case TableEnum.LOGS:
            routeService = LogService
            break
        case TableEnum.DAILY_PLANS:
            routeService = DailyPlanService
            break
        case TableEnum.WORKOUTS:
            routeService = WorkoutService
            break
        case TableEnum.WORKOUT_RESULTS:
            routeService = WorkoutResultService
            break
        case TableEnum.EXERCISES:
            routeService = ExerciseService
            break
        case TableEnum.EXERCISE_RESULTS:
            routeService = ExerciseResultService
            break
        case TableEnum.MEASUREMENTS:
            routeService = MeasurementService
            break
    }

    /**
     * Go to the specified data table route.
     */
    function goToTable(table: TableEnum) {
        try {
            router.push({
                name: RouteNameEnum.TABLE,
                params: { table },
            })
        } catch (error) {
            log.error('Error accessing Table route', error as Error)
        }
    }

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
        routeTable,
        routeService,
        goToTable,
        goBack,
    }
}
