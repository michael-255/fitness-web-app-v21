import {
    LimitEnum,
    LogLevelEnum,
    RouteNameEnum,
    SettingKeyEnum,
    TableEnum,
    TagEnum,
} from '@/shared/enums'
import { z } from 'zod'

// Enums
export const tableSchema = z.nativeEnum(TableEnum)
export const routeNameSchema = z.nativeEnum(RouteNameEnum)
export const tagSchema = z.nativeEnum(TagEnum)

// Setting
export const settingKeySchema = z.nativeEnum(SettingKeyEnum)
export const settingValueSchema = z
    .union([z.boolean(), z.number(), z.string(), z.null()])
    .optional()

// Log
export const logAutoIdSchema = z.number().int().optional()
export const logLevelSchema = z.nativeEnum(LogLevelEnum)
export const logLabelSchema = z.string().trim()
export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()

// Shared
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
export const nameSchema = z.string().min(LimitEnum.MIN_NAME).max(LimitEnum.MAX_NAME).trim()
export const textAreaSchema = z.string().max(LimitEnum.MAX_TEXT_AREA).trim() // For desc, notes, etc.
export const mockDataSchema = z.number()
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

// Models
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
export const exampleResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagListSchema,
    parentId: idSchema,
    note: textAreaSchema,
    mockData: mockDataSchema, // For testing charts on Examples
})
export const exampleSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagListSchema,
    name: nameSchema,
    desc: textAreaSchema,
    lastChild: exampleResultSchema.optional(),
})
