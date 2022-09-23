import { Card as MantineCard, Modal, Text } from '@mantine/core'
import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'

import { deleteCard, editCard, editAndMoveCard } from '../../reducers/columns'
import type { TypedDispatch } from '../../store'
import type { Card as CardType } from '../../types/card'
import CardForm from '../CardForm'

import classes from './styles.module.scss'

interface Props {
    card: CardType
    column: string
    index: number
}

export const Card: React.FC<Props> = ({ card, column, index }) => {
    const [opened, setOpened] = useState(false)
    const dispatch = useDispatch<TypedDispatch>()
    const _editCard = (
        title: string,
        description: string,
        newColumn: string
    ) => {
        if (newColumn === column) {
            dispatch(
                editCard(
                    {
                        card: {
                            ...card,
                            description,
                            title,
                        },
                        name: column,
                    },
                    () => {
                        setOpened(false)
                    }
                )
            )
        } else {
            dispatch(
                editAndMoveCard(
                    {
                        card: {
                            ...card,
                            description,
                            title,
                        },
                        name: column,
                        newColumnType: newColumn,
                    },
                    () => {
                        setOpened(false)
                    }
                )
            )
        }
    }

    const _deleteCard = () => {
        dispatch(
            deleteCard(
                {
                    cardId: card.id,
                    name: column,
                },
                () => {
                    setOpened(false)
                }
            )
        )
    }

    const toggleOpened = () => {
        setOpened((prev) => !prev)
    }

    return (
        <>
            <Draggable draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                    <MantineCard
                        onClick={toggleOpened}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Text className={classes['card__title']} weight={500}>
                            {card.title}
                        </Text>
                        <Text>{card.description}</Text>
                    </MantineCard>
                )}
            </Draggable>
            <Modal
                opened={opened}
                onClose={toggleOpened}
                title="Add card"
                centered
            >
                <CardForm
                    onSubmit={_editCard}
                    onDelete={_deleteCard}
                    title={card.title}
                    description={card.description}
                    name={column}
                />
            </Modal>
        </>
    )
}
