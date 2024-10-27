import type { TableEnum } from '@/shared/enums'
import type { IdType, SelectOption, ServiceType } from '@/shared/types'
import type { Observable } from 'dexie'
import type { QDialogOptions, QTableColumn } from 'quasar'
import type { z } from 'zod'
import DB, { Database } from './db'

/**
 * Abstract base class for all Services to extend. This defines properties and methods that other
 * Services may have. Only override the methods that are needed for the specific extending Service.
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
    abstract supportsActivityCharts: boolean
    abstract supportsCharts: boolean
    abstract supportsInspect: boolean
    abstract supportsCreate: boolean
    abstract supportsEdit: boolean
    abstract supportsDelete: boolean

    parentService(): ServiceType {
        throw new Error('Not supported by Service')
    }

    childService(): ServiceType {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    activityChartsDialogOptions(): QDialogOptions {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    chartsDialogOptions(id: IdType): QDialogOptions {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    inspectDialogOptions(id: IdType): QDialogOptions {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    createDialogOptions(parentId?: IdType): QDialogOptions {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    editDialogOptions(id: IdType): QDialogOptions {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    deleteDialogOptions(id: IdType): QDialogOptions {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    toggleFavoriteDialogOptions(id: IdType): QDialogOptions {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    async getChartDatasets(parentId: IdType): Promise<{
        threeMonths: {
            x: any
            y: any
        }[]
        oneYear: {
            x: any
            y: any
        }[]
        allTime: {
            x: any
            y: any
        }[]
        hasRecords: boolean
        hasRecordsBeyondThreeMonths: boolean
        hasRecordsBeyondOneYear: boolean
    }> {
        throw new Error('Not supported by Service')
    }

    async initialize(): Promise<Record<string, any>[]> {
        throw new Error('Not supported by Service')
    }

    liveDashboard(): Observable<Record<string, any>[]> {
        throw new Error('Not supported by Service')
    }

    liveTable(): Observable<Record<string, any>[]> {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    async get(id: IdType): Promise<Record<string, any>> {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    async add(record: Record<string, any>): Promise<Record<string, any>> {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    async put(record: Record<string, any>): Promise<Record<string, any>> {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    async remove(id: IdType): Promise<Record<string, any>> {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    async importData(records: Record<string, any>[]): Promise<{
        validRecords: Record<string, any>[]
        invalidRecords: Partial<Record<string, any>>[]
        importedCount: number
    }> {
        throw new Error('Not supported by Service')
    }

    async exportData(): Promise<Record<string, any>[]> {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    async updateLastChild(parentId: IdType): Promise<void> {
        throw new Error('Not supported by Service')
    }

    // eslint-disable-next-line
    async toggleFavorite(record: Record<string, any>): Promise<void> {
        throw new Error('Not supported by Service')
    }

    async getSelectOptions(): Promise<SelectOption[]> {
        throw new Error('Not supported by Service')
    }
}
