import LayoutMenu from '@/layouts/LayoutMenu.vue'
import PageDashboard from '@/pages/PageDashboard.vue'
import { RouteNameEnum } from '@/shared/enums'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: `/dashboard`, // Your default route
            name: RouteNameEnum.MENU_LAYOUT,
            component: LayoutMenu, // Must use a different layout for other primary routes
            children: [
                {
                    path: '/dashboard',
                    name: RouteNameEnum.DASHBOARD,
                    component: PageDashboard,
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
            path: '/examples-table',
            name: RouteNameEnum.EXAMPLES_TABLE,
            component: () => import('@/pages/PageTableExamples.vue'),
        },
        {
            path: '/example-results-table',
            name: RouteNameEnum.EXAMPLE_RESULTS_TABLE,
            component: () => import('@/pages/PageTableExampleResults.vue'),
        },
    ],
})

export default router
