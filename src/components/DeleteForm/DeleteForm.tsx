import { Button, Group } from '@mantine/core'
import React from 'react'

interface Props {
    onDelete: () => void
}

export const DeleteForm: React.FC<Props> = ({ onDelete }) => {
    return (
        <Group position="right">
            <Button type="submit">No, don't delete</Button>
            <Button color="red" onClick={onDelete}>
                Delete
            </Button>
        </Group>
    )
}
