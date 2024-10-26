import { StatusEnum } from '@/shared/enums'
import { defineStore } from 'pinia'

/**
 * Storing the currently selected record.
 */
const useSelectedStore = defineStore({
    id: 'selected',

    state: () => ({
        record: {} as Record<string, any>,
    }),

    getters: {
        lockedStatus: (state): boolean => {
            return state?.record?.status?.includes(StatusEnum.LOCKED) ?? false
        },
        favoritedStatus: (state): boolean => {
            return state?.record?.status?.includes(StatusEnum.FAVORITED) ?? false
        },
        hiddenStatus: (state): boolean => {
            return state?.record?.status?.includes(StatusEnum.HIDDEN) ?? false
        },
    },
})

export default useSelectedStore
