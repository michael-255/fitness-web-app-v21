<script setup lang="ts">
import PageFabMenu from '@/components/page/PageFabMenu.vue'
import PageHeading from '@/components/page/PageHeading.vue'
import PageResponsive from '@/components/page/PageResponsive.vue'
import PlanService from '@/services/PlanService'
import { appName } from '@/shared/constants'
import { RouteNameEnum, TableEnum } from '@/shared/enums'
import { addIcon, chartsIcon, databaseIcon, plansPageIcon } from '@/shared/icons'
import { compactDateFromMs, timeAgo } from '@/shared/utils'
import { useMeta, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Plans Dashboard` })

const $q = useQuasar()
const router = useRouter()

const phTimestamp = Date.now()
</script>

<template>
    <PageResponsive>
        <PageFabMenu
            :isLoading="$q.loading.isActive"
            :subButtons="[
                {
                    label: 'Plans Data',
                    color: 'primary',
                    icon: databaseIcon,
                    handleClick: () =>
                        router.push({
                            name: RouteNameEnum.TABLE,
                            params: { table: TableEnum.PLANS },
                        }),
                },
                {
                    label: 'Create Plan',
                    color: 'positive',
                    icon: addIcon,
                    handleClick: () => $q.dialog(PlanService.createDialogOptions()),
                },
            ]"
        />

        <PageHeading :headingIcon="plansPageIcon" :headingTitle="PlanService.labelPlural" />

        <q-list padding>
            <q-item>
                <q-item-section>
                    <q-card>
                        <q-item class="q-mt-sm">
                            <q-item-section top>
                                <q-item-label class="text-h5">Placeholder</q-item-label>

                                <q-item-label v-if="phTimestamp" caption>
                                    <div class="text-grey-5">
                                        {{ compactDateFromMs(phTimestamp) }}
                                    </div>

                                    <q-badge
                                        outline
                                        :color="timeAgo(phTimestamp).color"
                                        class="q-mt-xs"
                                    >
                                        {{ timeAgo(phTimestamp).message }}
                                    </q-badge>
                                </q-item-label>

                                <q-item-label v-else caption>
                                    No previous records found
                                </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                                <div class="row">
                                    <q-btn
                                        :disable="$q.loading.isActive"
                                        class="btn-translation"
                                        flat
                                        dense
                                        round
                                        color="cyan"
                                        :icon="chartsIcon"
                                    />
                                </div>
                            </q-item-section>
                        </q-item>
                    </q-card>
                </q-item-section>
            </q-item>
        </q-list>
    </PageResponsive>
</template>

<style scoped>
.btn-translation {
    transform: translateY(-12px) translateX(12px);
}
</style>
