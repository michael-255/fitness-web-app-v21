import type { TableEnum } from '@/shared/enums'
import type { QTableColumn } from 'quasar'
import type { z } from 'zod'
import type { Database } from './db'
import DB from './db'

/**
 * Abstract base class for all Services to extend. This defines properties and methods that other
 * Services may have. Only override the methods that are needed for the specific extending Service.
 * For properties, assign them a value in the extending Service if they will be used, or set them to
 * `null!` if they will not be used.
 */
export default abstract class BaseService {
    /**
     * Map of instances of each Service class. This is used to ensure that only one instance of each
     * Service class is created and used throughout the application.
     */
    private static _instances: Map<new () => BaseService, BaseService> = new Map()

    /**
     * Database instance used by all Services. This is set when the first Service is created by
     * the protected constructor.
     */
    private static _database: Database = null!

    protected constructor(database: Database = DB) {
        if (!BaseService._database) {
            BaseService._database = database
        }
    }

    /**
     * Singleton pattern that returns an instance of a class that extends the BaseService class.
     */
    static instance<S extends BaseService>(this: new () => S): S {
        if (!BaseService._instances.has(this)) {
            BaseService._instances.set(this, new this())
        }
        return BaseService._instances.get(this) as S
    }

    /**
     * Convenience method for accessing the Database instance.
     */
    protected get db(): Database {
        return BaseService._database
    }

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

    // eslint-disable-next-line
    prepareChartsDialog(...args: any[]) {
        throw new Error('prepareChartsDialog(): Not supported by this Service')
    }

    // eslint-disable-next-line
    prepareInspectDialog(...args: any[]) {
        throw new Error('prepareInspectDialog(): Not supported by this Service')
    }

    // eslint-disable-next-line
    prepareCreateDialog(...args: any[]) {
        throw new Error('prepareCreateDialog(): Not supported by this Service')
    }

    // eslint-disable-next-line
    prepareEditDialog(...args: any[]) {
        throw new Error('prepareEditDialog(): Not supported by this Service')
    }

    // eslint-disable-next-line
    prepareDeleteDialog(...args: any[]) {
        throw new Error('prepareDeleteDialog(): Not supported by this Service')
    }

    // eslint-disable-next-line
    initialize(...args: any[]) {
        throw new Error('initialize(): Not supported by this Service')
    }

    // eslint-disable-next-line
    liveDashboard(...args: any[]) {
        throw new Error('liveDashboard(): Not supported by this Service')
    }

    // eslint-disable-next-line
    liveTable(...args: any[]) {
        throw new Error('liveTable(): Not supported by this Service')
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
