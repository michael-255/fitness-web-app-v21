import { SettingKeyEnum } from '@/shared/enums'
import { z } from 'zod'

//
// Fields
//
export const settingKeySchema = z.nativeEnum(SettingKeyEnum)

export const settingValueSchema = z
    .union([z.boolean(), z.number(), z.string(), z.null()])
    .optional()

//
// Model
//
export const settingSchema = z.object({
    key: settingKeySchema,
    value: settingValueSchema,
})
