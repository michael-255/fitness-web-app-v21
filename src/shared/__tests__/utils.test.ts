import {
    columnOptionsFromTableColumns,
    compactDateFromMs,
    computedTagToggle,
    createId,
    durationFromMs,
    hiddenTableColumn,
    recordsCount,
    tableColumn,
    timeAgo,
    truncateText,
    visibleColumnsFromTableColumns,
} from '@/shared/utils'
import type { QTableColumn } from 'quasar'
import { expect, it, vi } from 'vitest'
import { DurationMSEnum, TableEnum, TagEnum } from '../enums'
import type { TagType } from '../types'

it('createId', () => {
    expect(() => createId('BAD' as TableEnum)).toThrow('Invalid Table: BAD')
    expect(createId(TableEnum.EXAMPLES).startsWith('exp-')).toBe(true)
})

it('hiddenTableColumn', () => {
    const column = hiddenTableColumn('id')

    // Test properties
    expect(column.name).toBe('hidden')
    expect(column.label).toBe('')
    expect(column.align).toBe('left')
    expect(column.sortable).toBe(false)
    expect(column.required).toBe(true)
    expect(column.style).toBe('display: none')

    // Test field function
    const row = { id: '123', name: 'Test' }
    expect((column.field as any)(row)).toBe('123')

    // Test format function
    expect((column.format as any)('123')).toBe('123')
})

it('tableColumn', () => {
    const uuidColumn = tableColumn('id', 'ID', 'UUID')
    expect((uuidColumn.format as any)('123456789')).toBe('12345678*')

    const textColumn = tableColumn('description', 'Description', 'TEXT')
    expect(
        (textColumn.format as any)('A very long description that exceeds forty characters'),
    ).toBe('A very long description that exceeds for...')

    const boolColumn = tableColumn('active', 'Active', 'BOOL')
    expect((boolColumn.format as any)(true)).toBe('Yes')
    expect((boolColumn.format as any)(false)).toBe('No')

    const jsonColumn = tableColumn('data', 'Data', 'JSON')
    expect((jsonColumn.format as any)({ key: 'value' })).toBe('{"key":"value"}')

    const dateColumn = tableColumn('timestamp', 'Timestamp', 'DATE')
    expect((dateColumn.format as any)(1609596950000)).toMatch(
        /^[A-Za-z]{3}, \d{4} [A-Za-z]{3} \d{1,2}(st|nd|rd|th), \d{1,2}:\d{2} (AM|PM)$/,
    )

    const listCountColumn = tableColumn('items', 'Items', 'LIST-COUNT')
    expect((listCountColumn.format as any)([1, 2, 3])).toBe('3')

    const listPrintColumn = tableColumn('items', 'Items', 'LIST-PRINT')
    expect((listPrintColumn.format as any)(['item1', 'item2', 'item3'])).toBe('item1, item2, item3')
})

it('columnOptionsFromTableColumns', () => {
    const columns: QTableColumn[] = [
        {
            name: 'id',
            label: 'ID',
            align: 'left',
            sortable: true,
            required: true,
            field: (row) => row.id,
            format: (val) => `${val}`,
        },
        {
            name: 'name',
            label: 'Name',
            align: 'left',
            sortable: true,
            required: false,
            field: (row) => row.name,
            format: (val) => `${val}`,
        },
        {
            name: 'age',
            label: 'Age',
            align: 'left',
            sortable: true,
            required: false,
            field: (row) => row.age,
            format: (val) => `${val}`,
        },
        {
            name: 'email',
            label: 'Email',
            align: 'left',
            sortable: true,
            required: true,
            field: (row) => row.email,
            format: (val) => `${val}`,
        },
    ]

    const result = columnOptionsFromTableColumns(columns)
    expect(result).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                name: 'name',
                label: 'Name',
                align: 'left',
                sortable: true,
                required: false,
                // Omitting field and format functions
            }),
            expect.objectContaining({
                name: 'age',
                label: 'Age',
                align: 'left',
                sortable: true,
                required: false,
                // Omitting field and format functions
            }),
        ]),
    )
})

it('visibleColumnsFromTableColumns', () => {
    const tableColumns: QTableColumn[] = [
        {
            name: 'id',
            required: true,
            label: 'ID',
            align: 'left',
            sortable: true,
            field: (row) => row.id,
        },
        {
            name: 'name',
            required: false,
            label: 'Name',
            align: 'left',
            sortable: true,
            field: (row) => row.name,
        },
        {
            name: 'email',
            required: false,
            label: 'Email',
            align: 'left',
            sortable: true,
            field: (row) => row.email,
        },
    ]

    const result = visibleColumnsFromTableColumns(tableColumns)
    expect(result).toEqual(['name', 'email'])
})

it('recordsCount', () => {
    expect(recordsCount([], 'Setting', 'Settings')).toBe('No Settings found')
    expect(recordsCount([{}], 'Setting', 'Settings')).toBe('1 Setting found')
    expect(recordsCount([{}, {}], 'Setting', 'Settings')).toBe('2 Settings found')
})

it('truncateText', () => {
    const str = 'Test string with 31 characters!'
    expect(truncateText(str, 10, '...')).toBe('Test strin...')
    expect(truncateText(str, 15, '*')).toBe('Test string wit*')
    expect(truncateText(null, 1, '...')).toBe('')
    expect(truncateText(undefined, 1, '*')).toBe('')
})

it('compactDateFromMs', () => {
    // I need a regex for this test
    expect(compactDateFromMs(1609596950000)).toMatch(
        /^[A-Za-z]{3}, \d{4} [A-Za-z]{3} \d{1,2}(st|nd|rd|th), \d{1,2}:\d{2} (AM|PM)$/,
    )
    expect(compactDateFromMs(null)).toBe('')
})

it('durationFromMs', () => {
    expect(durationFromMs(0)).toBe('')
    expect(durationFromMs(1000)).toBe('1s')
    expect(durationFromMs(60000)).toBe('1m ')
    expect(durationFromMs(3600000)).toBe('1h ')
    expect(durationFromMs(86400000)).toBe('1d ')
    expect(durationFromMs(90061000)).toBe('1d 1h 1m 1s')
    expect(durationFromMs(undefined)).toBe('')
    expect(durationFromMs(null)).toBe('')
})

it('computedTagToggle', () => {
    const selectedTags: TagType[] = [TagEnum.ENABLED, TagEnum.SKIPPED]
    let computedValue = computedTagToggle(selectedTags, TagEnum.ENABLED)
    expect(computedValue.value).toBe(true)

    computedValue = computedTagToggle(selectedTags, TagEnum.LOCKED)
    expect(computedValue.value).toBe(false)
})

it('timeAgo', () => {
    const now = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(now)

    // Test less than one minute ago
    expect(timeAgo(now - 30000)).toEqual({ message: 'just now', color: 'primary' })

    // Test one minute ago
    expect(timeAgo(now - DurationMSEnum['One Minute'])).toEqual({
        message: '1 minute ago',
        color: 'primary',
    })

    // Test multiple minutes ago
    expect(timeAgo(now - 2 * DurationMSEnum['One Minute'])).toEqual({
        message: '2 minutes ago',
        color: 'primary',
    })

    // Test one hour ago
    expect(timeAgo(now - DurationMSEnum['One Hour'])).toEqual({
        message: '1 hour ago',
        color: 'primary',
    })

    // Test multiple hours ago
    expect(timeAgo(now - 2 * DurationMSEnum['One Hour'])).toEqual({
        message: '2 hours ago',
        color: 'primary',
    })

    // Test one day ago
    expect(timeAgo(now - DurationMSEnum['One Day'])).toEqual({
        message: '1 day ago',
        color: 'positive',
    })

    // Test multiple days ago
    expect(timeAgo(now - 2 * DurationMSEnum['One Day'])).toEqual({
        message: '2 days ago',
        color: 'positive',
    })

    // Test one week ago
    expect(timeAgo(now - DurationMSEnum['One Week'])).toEqual({
        message: '1 week ago',
        color: 'positive',
    })

    // Test multiple weeks ago
    expect(timeAgo(now - 2 * DurationMSEnum['One Week'])).toEqual({
        message: '2 weeks ago',
        color: 'positive',
    })

    // Test one month ago
    expect(timeAgo(now - DurationMSEnum['One Month'])).toEqual({
        message: '1 month ago',
        color: 'amber',
    })

    // Test multiple months ago
    expect(timeAgo(now - 2 * DurationMSEnum['One Month'])).toEqual({
        message: '2 months ago',
        color: 'amber',
    })

    // Test one year ago
    expect(timeAgo(now - DurationMSEnum['One Year'])).toEqual({
        message: '1 year ago',
        color: 'warning',
    })

    // Test multiple years ago
    expect(timeAgo(now - 2 * DurationMSEnum['One Year'])).toEqual({
        message: '2 years ago',
        color: 'warning',
    })

    // Test future dates
    expect(timeAgo(now + DurationMSEnum['One Minute'])).toEqual({
        message: 'in 1 minute',
        color: 'primary',
    })
    expect(timeAgo(now + 2 * DurationMSEnum['One Minute'])).toEqual({
        message: 'in 2 minutes',
        color: 'primary',
    })
    expect(timeAgo(now + DurationMSEnum['One Hour'])).toEqual({
        message: 'in 1 hour',
        color: 'primary',
    })
    expect(timeAgo(now + 2 * DurationMSEnum['One Hour'])).toEqual({
        message: 'in 2 hours',
        color: 'primary',
    })
    expect(timeAgo(now + DurationMSEnum['One Day'])).toEqual({
        message: 'in 1 day',
        color: 'positive',
    })
    expect(timeAgo(now + 2 * DurationMSEnum['One Day'])).toEqual({
        message: 'in 2 days',
        color: 'positive',
    })
    expect(timeAgo(now + DurationMSEnum['One Week'])).toEqual({
        message: 'in 1 week',
        color: 'positive',
    })
    expect(timeAgo(now + 2 * DurationMSEnum['One Week'])).toEqual({
        message: 'in 2 weeks',
        color: 'positive',
    })
    expect(timeAgo(now + DurationMSEnum['One Month'])).toEqual({
        message: 'in 1 month',
        color: 'amber',
    })
    expect(timeAgo(now + 2 * DurationMSEnum['One Month'])).toEqual({
        message: 'in 2 months',
        color: 'amber',
    })
    expect(timeAgo(now + DurationMSEnum['One Year'])).toEqual({
        message: 'in 1 year',
        color: 'warning',
    })
    expect(timeAgo(now + 2 * DurationMSEnum['One Year'])).toEqual({
        message: 'in 2 years',
        color: 'warning',
    })
})
