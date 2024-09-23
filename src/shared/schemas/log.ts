import { LogLevelEnum } from '@/shared/enums'
import { z } from 'zod'
import { timestampSchema } from './shared'

//
// Fields
//
export const logAutoIdSchema = z.number().int().optional()

export const logLevelSchema = z.nativeEnum(LogLevelEnum)

export const logLabelSchema = z.string().trim()

export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()

//
// Model
//
export const logSchema = z.object({
    autoId: logAutoIdSchema,
    createdAt: timestampSchema,
    logLevel: logLevelSchema,
    label: logLabelSchema,
    details: logDetailsSchema,
})
