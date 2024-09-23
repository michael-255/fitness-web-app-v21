import Exercise from '@/models/Exercise'
import ExerciseResult from '@/models/ExerciseResult'
import Log from '@/models/Log'
import Measurement from '@/models/Measurements'
import Setting from '@/models/Setting'
import Workout from '@/models/Workout'
import WorkoutResult from '@/models/WorkoutResult'
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
    [TableEnum.MEASUREMENTS]!: Table<Measurement>;
    [TableEnum.WORKOUTS]!: Table<Workout>;
    [TableEnum.EXERCISES]!: Table<Exercise>;
    [TableEnum.WORKOUT_RESULTS]!: Table<WorkoutResult>;
    [TableEnum.EXERCISE_RESULTS]!: Table<ExerciseResult>

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [TableEnum.SETTINGS]: '&key',
            [TableEnum.LOGS]: '++autoId, createdAt',
            [TableEnum.MEASUREMENTS]: '&id, field, createdAt',
            [TableEnum.WORKOUTS]: '&id, name, *flags',
            [TableEnum.EXERCISES]: '&id, name, *flags',
            [TableEnum.WORKOUT_RESULTS]: '&id, exerciseId, createdAt',
            [TableEnum.EXERCISE_RESULTS]: '&id, workoutId, createdAt',
        })

        // Required for converting objects to classes
        this[TableEnum.SETTINGS].mapToClass(Setting)
        this[TableEnum.LOGS].mapToClass(Log)
        this[TableEnum.MEASUREMENTS].mapToClass(Measurement)
        this[TableEnum.WORKOUTS].mapToClass(Workout)
        this[TableEnum.EXERCISES].mapToClass(Exercise)
        this[TableEnum.WORKOUT_RESULTS].mapToClass(WorkoutResult)
        this[TableEnum.EXERCISE_RESULTS].mapToClass(ExerciseResult)
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
