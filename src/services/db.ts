import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import Setting from '@/models/Setting'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { TableEnum } from '@/shared/enums'
import Dexie, { type Table } from 'dexie'

/**
 * The database for the application defining the tables that are available and the models that are
 * mapped to those tables. An instance of this class is created and exported at the end of the file
 * below. Inject that instance into the `Service` class methods to perform database operations. This
 * was done to make testing easier and allow the `Services` to determine how to operate on the data.
 */
export class Database extends Dexie {
    private static _instance: Database | null = null;

    // Required for easier TypeScript usage
    [TableEnum.SETTINGS]!: Table<Setting>;
    [TableEnum.LOGS]!: Table<Log>;
    [TableEnum.EXAMPLES]!: Table<Example>;
    [TableEnum.EXAMPLE_RESULTS]!: Table<ExampleResult>
    // Table changes should be reflected here...

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [TableEnum.SETTINGS]: '&key',
            [TableEnum.LOGS]: '++autoId, createdAt',
            [TableEnum.EXAMPLES]: '&id, name, *tags',
            [TableEnum.EXAMPLE_RESULTS]: '&id, createdAt, parentId',
            // Table changes should be reflected here...
        })

        // Required for converting objects to classes
        this[TableEnum.SETTINGS].mapToClass(Setting)
        this[TableEnum.LOGS].mapToClass(Log)
        this[TableEnum.EXAMPLES].mapToClass(Example)
        this[TableEnum.EXAMPLE_RESULTS].mapToClass(ExampleResult)
        // Table changes should be reflected here...
    }

    static getSingleton(): Database {
        const databaseName = `${appName} v${appDatabaseVersion}`
        if (!Database._instance) {
            Database._instance = new Database(databaseName)
        }
        return Database._instance
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default Database.getSingleton()
