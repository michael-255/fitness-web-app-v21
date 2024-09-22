import {
    ExerciseInputEnum,
    LimitEnum,
    LogLevelEnum,
    MeasurementFieldEnum,
    RouteNameEnum,
    SettingKeyEnum,
    TableEnum,
    TagEnum,
} from '@/shared/enums'
import { z } from 'zod'

//
// Enums
//
export const tableSchema = z.nativeEnum(TableEnum)

export const routeNameSchema = z.nativeEnum(RouteNameEnum)

export const tagSchema = z.nativeEnum(TagEnum)

export const exerciseInputSchema = z.nativeEnum(ExerciseInputEnum)

export const measurementFieldSchema = z.nativeEnum(MeasurementFieldEnum)

//
// Setting
//
export const settingKeySchema = z.nativeEnum(SettingKeyEnum)

export const settingValueSchema = z
    .union([z.boolean(), z.number(), z.string(), z.null()])
    .optional()

//
// Log
//
export const logAutoIdSchema = z.number().int().optional()

export const logLevelSchema = z.nativeEnum(LogLevelEnum)

export const logLabelSchema = z.string().trim()

export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()

//
// Shared
//
export const idSchema = z.string().refine(
    (id) => {
        const tablePrefix = id.substring(0, 3)
        if (tableSchema.safeParse(tablePrefix).success) {
            // Trim off prefix plus '-' and check if uuid is valid
            if (z.string().uuid().safeParse(id.substring(4)).success) {
                return true // uuid valid
            } else {
                return false // uuid invalid
            }
        } else {
            return false // table prefix invalid
        }
    },
    {
        message: 'Invalid Id',
    },
)

export const timestampSchema = z.number().int()

export const optionalTimestampSchema = z.number().int().optional()

export const textLineSchema = z
    .string()
    .min(LimitEnum.MIN_TEXT_LINE)
    .max(LimitEnum.MAX_TEXT_LINE)
    .trim()

export const textAreaSchema = z.string().max(LimitEnum.MAX_TEXT_AREA).trim() // For desc, notes, etc.

export const tagListSchema = z
    .nativeEnum(TagEnum)
    .array()
    .refine(
        (tags) => {
            // Check for duplicates
            // Tags not used by a record type will be ignored
            return new Set(tags).size === tags.length
        },
        {
            message: 'Cannot have duplicate tags',
        },
    )

//
// Workouts
//
export const exerciseGroupSchema = z.object({
    exerciseIds: z.array(idSchema), // 2+ means it's a superset
})

export const exerciseResultGroupSchema = z.object({
    exerciseResultIds: z.array(idSchema.optional()), // undefined = exercise skipped or missing
})

//
// Exercises
//
export const initialSetCountSchema = z
    .number()
    .int()
    .min(LimitEnum.MIN_SETS)
    .max(LimitEnum.MAX_SETS)

export const restTimerSchema = z.object({
    defaultDuration: z.number().int(), // TODO
})

export const tabataTimerSchema = z.object({
    prepare: z.number().int(), // TODO
    work: z.number().int(), // TODO
    rest: z.number().int(), // TODO
    sets: z.number().int(), // TODO
    rounds: z.number().int(), // TODO
    restBetweenSets: z.number().int(), // TODO
    restBetweenRounds: z.number().int(), // TODO
})

export const setWeightSchema = z
    .number()
    .min(LimitEnum.MIN_SET_WEIGHT)
    .max(LimitEnum.MAX_SET_WEIGHT)

export const setRepsSchema = z
    .number()
    .int()
    .min(LimitEnum.MIN_SET_REPS)
    .max(LimitEnum.MAX_SET_REPS)

export const setRpeSchema = z.number().int().min(LimitEnum.MIN_SET_RPE).max(LimitEnum.MAX_SET_RPE)

export const checklistSetSchema = z.object({
    label: textLineSchema,
    checked: z.boolean(),
})

export const cardioSetSchema = z.object({
    duration: z.number().int(), // TODO
    calories: z.number().int(), // TODO
    rpe: setRpeSchema,
})

export const weightSetSchema = z.object({
    weight: setWeightSchema,
    reps: setRepsSchema,
    rpe: setRpeSchema,
})

export const sidedWeightSetSchema = z.object({
    left: weightSetSchema,
    right: weightSetSchema,
})

export const climbingSetSchema = z.object({
    listedGrade: z.any(), // TODO
    myGrade: z.any(), // TODO
    styles: z.any(), // TODO
    image: z.any(), // TODO
    attempts: z.any(), // TODO
    topped: z.boolean(),
})

//
// Measurements
//
export const caloriesSchema = z.any() // TODO

export const nutritionSchema = z.any() // TODO

export const bodyWeightSchema = z.any() // TODO

export const percentSchema = z.any() // TODO

export const bodyMassIndexSchema = z.any() // TODO

export const temperatureSchema = z.any() // TODO

export const bloodPressureSchema = z.any() // TODO

export const bodyMeasurementSchema = z.any() // TODO

//
// TODO: TEMPORARY
//
export const mockDataSchema = z.number()

//
// Models
//
export const settingSchema = z.object({
    key: settingKeySchema,
    value: settingValueSchema,
})

export const logSchema = z.object({
    autoId: logAutoIdSchema,
    createdAt: timestampSchema,
    logLevel: logLevelSchema,
    label: logLabelSchema,
    details: logDetailsSchema,
})

export const measurementSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    note: textAreaSchema,
    field: measurementFieldSchema,
    // Diet & Weight
    calories: caloriesSchema.optional(),
    carbs: nutritionSchema.optional(),
    fat: nutritionSchema.optional(),
    protein: nutritionSchema.optional(),
    weight: bodyWeightSchema.optional(),
    bodyFat: percentSchema.optional(),
    bodyMassIndex: bodyMassIndexSchema.optional(), // TODO: Should this value just be computed?
    // Health
    temperature: temperatureSchema.optional(),
    bloodPressure: bloodPressureSchema.optional(),
    bloodOxygen: percentSchema.optional(),
    // Body
    height: bodyMeasurementSchema.optional(),
    neck: bodyMeasurementSchema.optional(),
    shoulders: bodyMeasurementSchema.optional(),
    chest: bodyMeasurementSchema.optional(),
    waist: bodyMeasurementSchema.optional(),
    leftBicep: bodyMeasurementSchema.optional(), // TODO: Combine to { left, right }?
    rightBicep: bodyMeasurementSchema.optional(),
    leftForearm: bodyMeasurementSchema.optional(),
    rightForearm: bodyMeasurementSchema.optional(),
    leftThigh: bodyMeasurementSchema.optional(),
    rightThigh: bodyMeasurementSchema.optional(),
    leftCalf: bodyMeasurementSchema.optional(),
    rightCalf: bodyMeasurementSchema.optional(),
})

export const workoutResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagListSchema,
    workoutId: idSchema,
    note: textAreaSchema,
    finishedAt: optionalTimestampSchema,
    warmupResultGroups: z.array(exerciseResultGroupSchema),
    cooldownResultGroups: z.array(exerciseResultGroupSchema),
    exerciseResultGroups: z.array(exerciseResultGroupSchema),
})

export const workoutSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: workoutResultSchema.optional(),
    warmupGroups: z.array(exerciseGroupSchema),
    cooldownGroups: z.array(exerciseGroupSchema),
    exerciseGroups: z.array(exerciseGroupSchema),
    nextWorkoutIds: z.array(idSchema),
})

export const exerciseResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagListSchema,
    exerciseId: idSchema,
    note: textAreaSchema,
    checklistSets: z.array(checklistSetSchema).optional(),
    cardioSets: z.array(cardioSetSchema).optional(),
    weightSets: z.array(weightSetSchema).optional(),
    sidedWeightSets: z.array(sidedWeightSetSchema).optional(),
    climbingSets: z.array(climbingSetSchema).optional(),
})

export const exerciseSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: exerciseResultSchema.optional(),
    inputs: exerciseInputSchema,
    initialSetCount: initialSetCountSchema,
    restTimer: restTimerSchema.optional(),
    tabataTimer: tabataTimerSchema.optional(),
})

// TODO: Remove
export const exampleResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagListSchema,
    parentId: idSchema,
    note: textAreaSchema,
    mockData: mockDataSchema, // For testing charts on Examples
})

// TODO: Remove
export const exampleSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: exampleResultSchema.optional(),
})
