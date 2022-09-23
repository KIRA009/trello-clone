import {
    Button,
    Group,
    Modal,
    Select,
    Textarea,
    TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { getColumns } from '../../reducers/columns'
import DeleteForm from '../DeleteForm'

interface Props {
    onSubmit: (title: string, description: string, name: string) => void
    onDelete?: () => void
    title?: string
    description?: string
    name?: string
}

export const CardForm: React.FC<Props> = ({
    onSubmit,
    onDelete,
    title = '',
    description = '',
    name = '',
}) => {
    const [opened, setOpened] = useState(false)
    const columns = useSelector(getColumns)
    const form = useForm({
        initialValues: {
            description,
            name,
            title,
        },
        validate: {
            description: (value) =>
                value.length >= 25
                    ? null
                    : 'Description should be at least 25 characters long',
            name: (value) =>
                columns.findIndex((column) => column.name === value) !== -1
                    ? null
                    : 'Column type should be one of the existing columns',
            title: (value) =>
                /^[A-Za-z\s]*$/.test(value)
                    ? null
                    : 'Title should only contain alphabets',
        },
    })
    const submitForm = (values: any) => {
        onSubmit(values.title, values.description, values.name)
    }
    const _deleteCard = () => {
        if (onDelete) onDelete()
    }
    return (
        <form onSubmit={form.onSubmit(submitForm)}>
            <TextInput
                withAsterisk
                label="Title"
                placeholder="Title of the card"
                {...form.getInputProps('title')}
            />
            <Textarea
                withAsterisk
                label="Description"
                placeholder="A small description"
                {...form.getInputProps('description')}
            />
            <Select
                label="Column"
                placeholder="Pick one"
                data={columns.map((column) => ({
                    label: column.name,
                    value: column.name,
                }))}
                {...form.getInputProps('name')}
            />
            <Group position="right" mt="md">
                {onDelete && (
                    <Button color="red" onClick={() => setOpened(true)}>
                        Delete
                    </Button>
                )}
                <Button type="submit">Submit</Button>
            </Group>
            {onDelete && (
                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Delete card"
                    centered
                >
                    <DeleteForm onDelete={onDelete} />
                </Modal>
            )}
        </form>
    )
}
