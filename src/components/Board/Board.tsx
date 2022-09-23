import { Button, createStyles, Modal } from '@mantine/core'
import { useState } from 'react'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext } from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'

import {
    addCardToColumn,
    addColumn,
    deleteCard,
    getColumns,
    moveCardToIndex,
} from '../../reducers/columns'
import type { TypedDispatch } from '../../store'
import { findNthCard } from '../../utils'
import Column from '../Column'
import ColumnForm from '../ColumnForm'

import classes from './styles.module.scss'

export const Board: React.FC = () => {
    const [opened, setOpened] = useState(false)
    const columns = useSelector(getColumns)
    const dispatch = useDispatch<TypedDispatch>()
    const getNumColumnsStyle = createStyles({
        columns: {
            gridTemplateColumns: `repeat(${Math.max(
                columns.length + 1,
                5
            )}, 1fr)`,
        },
    })().classes
    const onDragEnd = (result: DropResult) => {
        if (result.destination) {
            if (
                result.destination.droppableId === result.source.droppableId &&
                result.source.index === result.destination.index
            )
                return

            // find source column by columntype
            const cardId = result.draggableId
            const sourceColumn = columns.find(
                (b) => b.name === result.source.droppableId
            )

            if (sourceColumn) {
                const card = sourceColumn.cards[cardId]

                // find destination column by columntype
                const destinationColumn = columns.find(
                    (b) => b.name === result.destination?.droppableId
                )

                if (destinationColumn) {
                    const destinationCard = findNthCard(
                        destinationColumn.cards,
                        destinationColumn.head,
                        result.destination.index
                    )

                    // delete card from source column
                    dispatch(
                        deleteCard(
                            {
                                cardId,
                                name: sourceColumn.name,
                            },
                            () => {}
                        )
                    )

                    // add card to destination column
                    if (
                        destinationCard === null ||
                        (destinationCard !== null &&
                            destinationCard.next === null)
                    ) {
                        // add card to end of new column
                        dispatch(
                            addCardToColumn(
                                {
                                    card: { ...card },
                                    name: destinationColumn.name,
                                },
                                () => {}
                            )
                        )
                    } else {
                        // move card
                        dispatch(
                            moveCardToIndex({
                                card: { ...card },
                                toColumnType: destinationColumn.name,
                                toIndex: result.destination.index,
                            })
                        )
                    }
                }
            }
        }
    }
    const toggleOpened = () => {
        setOpened((prev) => !prev)
    }
    const _addColumn = (name: string) => {
        dispatch(addColumn(name, toggleOpened))
    }
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={classes.board}>
                <div
                    className={`${classes.board__container} ${getNumColumnsStyle.columns}`}
                >
                    {columns.map((column) => (
                        <Column column={column} key={column.name} />
                    ))}
                    <Button
                        onClick={toggleOpened}
                        className={classes['board__add-column-btn']}
                    >
                        Add column
                    </Button>
                    <Modal
                        opened={opened}
                        onClose={toggleOpened}
                        title="Add card"
                        centered
                    >
                        <ColumnForm onSubmit={_addColumn} />
                    </Modal>
                </div>
            </div>
        </DragDropContext>
    )
}
