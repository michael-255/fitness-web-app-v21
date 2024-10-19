import LayoutMenu from '@/layouts/LayoutMenu.vue'
import PageDashboardWorkouts from '@/pages/PageDashboardWorkouts.vue'
import { RouteNameEnum } from '@/shared/enums'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: `/workouts`, // Your default route
            name: RouteNameEnum.MENU_LAYOUT,
            component: LayoutMenu, // Must use a different layout for other primary routes
            children: [
                {
                    path: '/workouts',
                    name: RouteNameEnum.WORKOUTS_DASHBOARD,
                    component: PageDashboardWorkouts,
                },
                {
                    path: '/exercises',
                    name: RouteNameEnum.EXERCISES_DASHBOARD,
                    component: () => import('@/pages/PageDashboardExercises.vue'),
                },
                {
                    path: '/measurements',
                    name: RouteNameEnum.MEASUREMENTS_DASHBOARD,
                    component: () => import('@/pages/PageDashboardMeasurements.vue'),
                },
                {
                    path: '/settings',
                    name: RouteNameEnum.SETTINGS,
                    component: () => import('@/pages/PageSettings.vue'),
                },
                {
                    path: '/about',
                    name: RouteNameEnum.ABOUT,
                    component: () => import('@/pages/PageAbout.vue'),
                },
                {
                    path: '/donate',
                    name: RouteNameEnum.DONATE,
                    component: () => import('@/pages/PageDonate.vue'),
                },
                {
                    path: '/:pathMatch(.*)*', // 404 Not Found. Part of default route path.
                    name: RouteNameEnum.NOT_FOUND,
                    component: () => import('@/pages/PageNotFound.vue'),
                },
            ],
        },
        // Table routes are fullscreen and have no layout
        // {
        //     path: '/:routeTable/table',
        //     name: RouteNameEnum.TABLE,
        //     component: PageTable,
        //     beforeEnter: (to: any, _: any, next: Function) => {
        //         const routeTable = to.params.table
        //         const isRouteTableValid = tableSchema.safeParse(routeTable).success

        //         if (!isRouteTableValid) {
        //             return next({ name: RouteNameEnum.NOT_FOUND })
        //         }

        //         return next()
        //     },
        // },
        {
            path: '/setttings-table',
            name: RouteNameEnum.SETTINGS_TABLE,
            component: () => import('@/pages/PageTableSettings.vue'),
        },
        {
            path: '/logs-table',
            name: RouteNameEnum.LOGS_TABLE,
            component: () => import('@/pages/PageTableLogs.vue'),
        },
        {
            path: '/workouts-table',
            name: RouteNameEnum.WORKOUTS_TABLE,
            component: () => import('@/pages/PageTableWorkouts.vue'),
        },
        {
            path: '/workout-results-table',
            name: RouteNameEnum.WORKOUT_RESULTS_TABLE,
            component: () => import('@/pages/PageTableWorkoutResults.vue'),
        },
        {
            path: '/exercises-table',
            name: RouteNameEnum.EXERCISES_TABLE,
            component: () => import('@/pages/PageTableExercises.vue'),
        },
        {
            path: '/exercise-results-table',
            name: RouteNameEnum.EXERCISE_RESULTS_TABLE,
            component: () => import('@/pages/PageTableExerciseResults.vue'),
        },
        {
            path: '/measurements-table',
            name: RouteNameEnum.MEASUREMENTS_TABLE,
            component: () => import('@/pages/PageTableMeasurements.vue'),
        },
    ],
})

export default router
