import type { TableEnum } from '@/shared/enums'
import type { CustomComponentType } from '@/shared/types'
import type { QTableColumn } from 'quasar'
import type { z } from 'zod'
import type { Database } from './db'

/**
 * Abstract base class for all Services to extend. This defines properties and methods that other
 * Services may have. Only override the methods that are needed for the specific extending Service.
 * For properties, assign them a value in the extending Service if they will be used, or set them to
 * `null!` if they will not be used.
 */
export default abstract class BaseService {
    abstract db: Database // This should be handled by the singleton constructor
    abstract labelSingular: string
    abstract labelPlural: string
    abstract modelSchema: z.ZodSchema<any>
    abstract table: TableEnum
    abstract tableColumns: QTableColumn[]
    abstract displayIcon: string
    abstract tableIcon: string
    abstract supportsTableColumnFilters: boolean
    abstract supportsTableCharts: boolean
    abstract supportsCharts: boolean
    abstract supportsInspect: boolean
    abstract supportsCreate: boolean
    abstract supportsEdit: boolean
    abstract supportsDelete: boolean
    abstract chartsDialogProps: CustomComponentType
    abstract inspectDialogProps: CustomComponentType
    abstract createDialogProps: CustomComponentType
    abstract editDialogProps: CustomComponentType
    abstract deleteDialogProps: CustomComponentType

    // eslint-disable-next-line
    initialize(...args: any[]) {
        throw new Error('initialize(): Not supported by this Service')
    }

    // eslint-disable-next-line
    liveDashboardObservable(...args: any[]) {
        throw new Error('liveDashboardObservable(): Not supported by this Service')
    }

    // eslint-disable-next-line
    liveObservable(...args: any[]) {
        throw new Error('liveObservable(): Not supported by this Service')
    }

    // eslint-disable-next-line
    get(...args: any[]) {
        throw new Error('get(): Not supported by this Service')
    }

    // eslint-disable-next-line
    add(...args: any[]) {
        throw new Error('add(): Not supported by this Service')
    }

    // eslint-disable-next-line
    put(...args: any[]) {
        throw new Error('put(): Not supported by this Service')
    }

    // eslint-disable-next-line
    remove(...args: any[]) {
        throw new Error('remove(): Not supported by this Service')
    }

    // eslint-disable-next-line
    clear(...args: any[]) {
        throw new Error('clear(): Not supported by this Service')
    }

    // eslint-disable-next-line
    importData(...args: any[]) {
        throw new Error('importData(): Not supported by this Service')
    }

    // eslint-disable-next-line
    exportData(...args: any[]) {
        throw new Error('exportData(): Not supported by this Service')
    }

    // eslint-disable-next-line
    updateLastChild(...args: any[]) {
        throw new Error('updateLastChild(): Not supported by this Service')
    }

    // eslint-disable-next-line
    toggleFavorite(...args: any[]) {
        throw new Error('toggleFavorite(): Not supported by this Service')
    }

    // eslint-disable-next-line
    getSelectOptions(...args: any[]) {
        throw new Error('getSelectOptions(): Not supported by this Service')
    }

    // eslint-disable-next-line
    purge(...args: any[]) {
        throw new Error('purge(): Not supported by this Service')
    }
}
