import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'
import { useSelector } from 'react-redux'

import { getColumns } from '../../reducers/columns'

interface Props {
    onSubmit: (name: string) => void
    name?: string
}

export const ColumnForm: React.FC<Props> = ({ onSubmit, name = '' }) => {
    const columns = useSelector(getColumns)
    const form = useForm({
        initialValues: {
            name,
        },
        validate: {
            name: (value) =>
                columns.findIndex((column) => column.name === value) === -1
                    ? null
                    : 'Column name cannot be same as one of the existing columns',
        },
    })
    const submitForm = (values: any) => {
        onSubmit(values.name)
    }
    return (
        <form onSubmit={form.onSubmit(submitForm)}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="Name of the column"
                {...form.getInputProps('name')}
            />
            <Group position="right" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    )
}
