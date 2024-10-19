import { LimitEnum, RouteNameEnum, StatusEnum, TableEnum } from '@/shared/enums'
import { z } from 'zod'

//
// Enums
//

export const tableSchema = z.nativeEnum(TableEnum)

export const routeNameSchema = z.nativeEnum(RouteNameEnum)

export const statusSchema = z.nativeEnum(StatusEnum)

//
// Common
//

export const idSchema = z.string().refine(
    (id) => {
        // Trim off prefix and check if uuid is valid
        // Does not validate if the prefix is correct
        if (z.string().uuid().safeParse(id.substring(4)).success) {
            return true // uuid valid
        } else {
            return false // uuid invalid
        }
    },
    {
        message: 'Invalid Id',
    },
)

export const timestampSchema = z.number().int()

export const textLineSchema = z
    .string()
    .min(LimitEnum.MIN_TEXT_LINE)
    .max(LimitEnum.MAX_TEXT_LINE)
    .trim()

export const textAreaSchema = z.string().max(LimitEnum.MAX_TEXT_AREA).trim() // For desc, notes, etc.

export const statusListSchema = z
    .nativeEnum(StatusEnum)
    .array()
    .refine(
        (status) => {
            // Check for duplicates
            // Status not used by a record type will be ignored
            return new Set(status).size === status.length
        },
        {
            message: 'Cannot have duplicate status',
        },
    )
