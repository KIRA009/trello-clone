import { Group, Modal, Stack, ActionIcon } from '@mantine/core'
import React, { useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { CirclePlus, Trash } from 'tabler-icons-react'

import { addCardToColumn, deleteColumn } from '../../reducers/columns'
import type { TypedDispatch } from '../../store'
import type { Column as ColumnType } from '../../types/column'
import { createCard, getCardList } from '../../utils'
import Card from '../Card'
import CardForm from '../CardForm'
import DeleteForm from '../DeleteForm'

import classes from './styles.module.scss'

interface Props {
    column: ColumnType
}

export const Column: React.FC<Props> = ({ column }) => {
    const [addModalOpened, setAddModalOpened] = useState(false)
    const [deleteModalOpened, setDeleteModalOpened] = useState(false)

    const dispatch = useDispatch<TypedDispatch>()
    const _addCard = (title: string, description: string, name: string) => {
        dispatch(
            addCardToColumn(
                {
                    card: createCard(title, description),
                    name,
                },
                () => {
                    setAddModalOpened(false)
                }
            )
        )
    }
    const _deleteColumn = () => {
        dispatch(
            deleteColumn(column.name, () => {
                setDeleteModalOpened(false)
            })
        )
    }

    const cards = getCardList(column.cards, column.head)

    return (
        <div className={classes.column}>
            <div className={classes['column__header']}>
                <span>{column.name}</span>
                <Group className={classes['column__actions']}>
                    <ActionIcon onClick={() => setAddModalOpened(true)}>
                        <CirclePlus />
                    </ActionIcon>
                    <ActionIcon onClick={() => setDeleteModalOpened(true)}>
                        <Trash />
                    </ActionIcon>
                </Group>
            </div>
            <Droppable droppableId={column.name}>
                {(provided, snapshot) => (
                    <Stack
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={classes['column__list']}
                    >
                        {cards.map((card, index) => (
                            <Card
                                card={card}
                                column={column.name}
                                index={index}
                                key={card.id}
                            />
                        ))}
                        {cards.length === 0 && (
                            <div className={classes['column__empty']}>
                                <span>No cards</span>
                            </div>
                        )}
                        {provided.placeholder}
                    </Stack>
                )}
            </Droppable>
            <Modal
                opened={addModalOpened}
                onClose={() => setAddModalOpened(false)}
                title="Add card"
                centered
            >
                <CardForm onSubmit={_addCard} name={column.name} />
            </Modal>
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title="Delete column"
                centered
            >
                <DeleteForm onDelete={_deleteColumn} />
            </Modal>
        </div>
    )
}
