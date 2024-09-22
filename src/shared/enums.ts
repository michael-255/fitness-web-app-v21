/**
 * Route names used by the router for page selection.
 */
export enum RouteNameEnum {
    MENU_LAYOUT = 'MenuLayout',
    WORKOUTS_DASHBOARD = 'WorkoutsDashboard',
    EXERCISES_DASHBOARD = 'ExercisesDashboard',
    MEASUREMENTS_DASHBOARD = 'MeasurementsDashboard',
    SETTINGS_TABLE = 'SettingsTable',
    LOGS_TABLE = 'LogsTable',
    EXAMPLES_TABLE = 'ExamplesTable', // TODO: Remove
    EXAMPLE_RESULTS_TABLE = 'ExampleResultsTable', // TODO: Remove
    WORKOUTS_TABLE = 'WorkoutsTable',
    WORKOUT_RESULTS_TABLE = 'WorkoutResultsTable',
    EXERCISES_TABLE = 'ExercisesTable',
    EXERCISE_RESULTS_TABLE = 'ExerciseResultsTable',
    MEASUREMENTS_TABLE = 'MeasurementsTable',
    SETTINGS = 'Settings',
    ABOUT = 'About',
    DONATE = 'Donate',
    NOT_FOUND = 'NotFound',
}

/**
 * Shortened string representations of database tables. Used as prefixes for Ids.
 * This can help with database operations and debugging.
 */
export enum TableEnum {
    SETTINGS = 'settings', // Standalone
    LOGS = 'logs', // Standalone
    MEASUREMENTS = 'mea', // Standalone
    EXAMPLES = 'exp', // TODO: Remove
    EXAMPLE_RESULTS = 'exr', // TODO: Remove
    WORKOUTS = 'wop', // Parent
    WORKOUT_RESULTS = 'wor', // Child
    EXERCISES = 'exp', // Parent
    EXERCISE_RESULTS = 'exr', // Child
}

/**
 * Valid keys for settings in the application.
 */
export enum SettingKeyEnum {
    ADVANCED_MODE = 'advanced-mode',
    INSTRUCTIONS_OVERLAY = 'instructions-overlay',
    CONSOLE_LOGS = 'console-logs',
    INFO_MESSAGES = 'info-messages',
    LOG_RETENTION_DURATION = 'log-retention-duration',
}

export enum LogLevelEnum {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

/**
 * Tags used for flaging certain records for the application to change their behavior.
 * Dexie index on these tags for quick access.
 */
export enum TagEnum {
    LOCKED = 'Locked', // Shared
    ENABLED = 'Enabled', // Parent
    FAVORITED = 'Favorited', // Parent
}

export enum LimitEnum {
    MAX_ID = 30,
    MAX_FILE_SIZE = 1_000_000,
    MAX_TEXT_AREA = 250,
    MIN_TEXT_LINE = 1,
    MAX_TEXT_LINE = 50,
}

export enum DurationEnum {
    Now = 'Now',
    'One Second' = 'One Second',
    'One Minute' = 'One Minute',
    'One Hour' = 'One Hour',
    'One Day' = 'One Day',
    'One Week' = 'One Week',
    'One Month' = 'One Month',
    'Three Months' = 'Three Months',
    'Six Months' = 'Six Months',
    'One Year' = 'One Year',
    'Two Years' = 'Two Years',
    'Three Years' = 'Three Years',
    'All Time' = 'All Time',
    'Forever' = 'Forever',
}

export enum DurationMSEnum {
    Now = 1,
    'One Second' = 1_000,
    'One Minute' = 60_000,
    'One Hour' = 3_600_000,
    'One Day' = 86_400_000,
    'One Week' = 604_800_000,
    'One Month' = 2_592_000_000,
    'Three Months' = 7_776_000_000,
    'Six Months' = 15_552_000_000,
    'One Year' = 31_536_000_000,
    'Two Years' = 63_072_000_000,
    'Three Years' = 94_608_000_000,
    'All Time' = Number.MAX_SAFE_INTEGER - 1, // So it doesn't match 'Forever'
    'Forever' = Number.MAX_SAFE_INTEGER,
}
