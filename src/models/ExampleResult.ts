import { TableEnum } from '@/shared/enums'
import type { IdType, MockDataType, TagType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

/**
 * `ExampleResult` child model.
 */
export default class ExampleResult {
    id: IdType
    createdAt: TimestampType
    tags: TagType[]
    parentId: IdType
    note: TextAreaType
    mockData: MockDataType

    constructor({
        id,
        createdAt,
        tags,
        parentId,
        note,
        mockData,
    }: {
        id?: IdType
        createdAt?: TimestampType
        tags?: TagType[]
        parentId: IdType
        note?: TextAreaType
        mockData?: MockDataType
    }) {
        this.id = id ?? createId(TableEnum.EXAMPLE_RESULTS)
        this.createdAt = createdAt ?? Date.now()
        this.tags = tags ?? []
        this.parentId = parentId
        this.note = note ?? ''
        // Mock data is a random number between -100 and 100
        this.mockData = mockData ?? Math.floor(Math.random() * 200) - 100
    }
}
