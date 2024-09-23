import { z } from 'zod'
import type { settingKeySchema, settingSchema, settingValueSchema } from '../schemas/setting'

//
// Fields
//
export type SettingKeyType = z.infer<typeof settingKeySchema>

export type SettingValueType = z.infer<typeof settingValueSchema>

//
// Model
//
export type SettingType = z.infer<typeof settingSchema>
