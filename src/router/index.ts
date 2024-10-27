import LayoutMenu from '@/layouts/LayoutMenu.vue'
import PageDashboardDailyPlans from '@/pages/PageDashboardDailyPlans.vue'
import PageDashboardExercises from '@/pages/PageDashboardExercises.vue'
import PageDashboardMeasurements from '@/pages/PageDashboardMeasurements.vue'
import PageDashboardWorkouts from '@/pages/PageDashboardWorkouts.vue'
import PageTable from '@/pages/PageTable.vue'
import { RouteNameEnum } from '@/shared/enums'
import { tableSchema } from '@/shared/schemas'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Dashboard components are more unique and will likely need dedicated routes
        {
            path: '/',
            redirect: `/daily-plans-dashboard`, // Your default route
            name: RouteNameEnum.MENU_LAYOUT,
            component: LayoutMenu, // Must use a different layout for other primary routes
            children: [
                {
                    path: '/daily-plans-dashboard',
                    name: RouteNameEnum.DAILY_PLANS_DASHBOARD,
                    component: PageDashboardDailyPlans,
                },
                {
                    path: '/workouts-dashboard',
                    name: RouteNameEnum.WORKOUTS_DASHBOARD,
                    component: PageDashboardWorkouts,
                },
                {
                    path: '/exercises-dashboard',
                    name: RouteNameEnum.EXERCISES_DASHBOARD,
                    component: PageDashboardExercises,
                },
                {
                    path: '/measurements-dashboard',
                    name: RouteNameEnum.MEASUREMENTS_DASHBOARD,
                    component: PageDashboardMeasurements,
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
        {
            path: '/:table/table',
            name: RouteNameEnum.TABLE,
            component: PageTable,
            beforeEnter: (to: any, _: any, next: Function) => {
                const routeTable = to.params.table
                const isRouteTable = tableSchema.safeParse(routeTable).success

                if (!isRouteTable) {
                    return next({
                        name: RouteNameEnum.NOT_FOUND,
                    })
                }
                return next()
            },
        },
    ],
})

export default router
