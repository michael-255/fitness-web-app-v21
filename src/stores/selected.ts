import type { ExampleResultType, ExampleType, LogType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * Storing the currently selected records for any form and whether it is valid.
 */
const useSelectedStore = defineStore({
    id: 'selected',

    state: () => ({
        isLogValid: true,
        isExampleValid: true,
        isExampleResultValid: true,
        log: {} as LogType,
        example: {} as ExampleType,
        exampleResult: {} as ExampleResultType,
    }),
})

export default useSelectedStore
