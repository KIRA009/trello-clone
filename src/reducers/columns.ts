import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { AppThunk, RootState } from '../store'
import type { Card } from '../types/card'
import type { Column } from '../types/column'
import { findNthCard } from '../utils'

const initialState: Column[] = []

const columnsSlice = createSlice({
    initialState,
    name: 'columns',
    reducers: {
        addCardToColumn(
            state,
            action: PayloadAction<{ name: string; card: Card }>
        ) {
            const { name, card } = action.payload
            const columnIndex = state.findIndex((b) => b.name === name)
            if (columnIndex === -1) {
                throw new Error('Column not found')
            }
            const column = state[columnIndex]
            // set card as the last card on this column
            card.next = null
            card.prev = column.tail

            // generate new id for the card and make it the new tail
            const newId = Math.random().toString(36).substr(2, 9)
            card.id = newId
            if (column.tail !== null) {
                // update current tail's next to point to the new card
                state[columnIndex].cards[column.tail].next = newId
            }
            state[columnIndex].cards[newId] = card
            state[columnIndex].tail = newId
            if (state[columnIndex].head === null) {
                state[columnIndex].head = newId
            }
        },
        addColumn: (state, action: PayloadAction<string>) => {
            state.push({
                cards: {},
                head: null,
                name: action.payload,
                tail: null,
            })
        },
        deleteCard(
            state,
            action: PayloadAction<{ name: string; cardId: string }>
        ) {
            const { name, cardId } = action.payload
            const columnIndex = state.findIndex((b) => b.name === name)
            if (columnIndex === -1) {
                throw new Error('Column not found')
            }
            const column = state[columnIndex]
            const card = column.cards[cardId]
            if (card === undefined) {
                throw new Error('Card not found')
            }
            if (card.prev !== null) {
                state[columnIndex].cards[card.prev].next = card.next
            }
            if (card.next !== null) {
                state[columnIndex].cards[card.next].prev = card.prev
            }
            if (column.head === cardId) {
                column.head = card.next
            }
            if (column.tail === cardId) {
                column.tail = card.prev
            }
            delete column.cards[cardId]
        },
        deleteColumn: (state, action: PayloadAction<string>) => {
            const columnIndex = state.findIndex(
                (b) => b.name === action.payload
            )
            if (columnIndex === -1) {
                throw new Error('Column not found')
            }
            state.splice(columnIndex, 1)
        },
        editCard(state, action: PayloadAction<{ name: string; card: Card }>) {
            const { name, card } = action.payload
            const columnIndex = state.findIndex((b) => b.name === name)
            if (columnIndex === -1) {
                throw new Error('Column not found')
            }
            state[columnIndex].cards[card.id] = card
        },
        moveCard(
            state,
            action: PayloadAction<{
                name: string
                card: Card
                newColumnType: string
            }>
        ) {
            const { name, card, newColumnType } = action.payload
            // const columnIndex = state.findIndex(b => b.name === name);
            // if (columnIndex === -1) {
            //     throw new Error('Column not found');
            // }
            const newColumnIndex = state.findIndex(
                (b) => b.name === newColumnType
            )
            if (newColumnIndex === -1) {
                throw new Error('New column not found')
            }
            // const column = state[columnIndex];
            const newColumn = state[newColumnIndex]

            // const card = column.cards[cardId];
            // delete column.cards[cardId];
            if (card === undefined) {
                throw new Error('Card not found')
            }
            // if (card.prev !== null) {
            //     state[columnIndex].cards[card.prev].next = card.next;
            // }
            // if (card.next !== null) {
            //     state[columnIndex].cards[card.next].prev = card.prev;
            // }
            // // if (column.head === cardId) {
            // //     column.head = card.next;
            // // }
            // // if (column.tail === cardId) {
            // //     column.tail = card.prev;
            // // }
            if (newColumn.head === null) {
                newColumn.head = card.id
            }
            if (newColumn.tail === null) {
                card.prev = null
            } else {
                card.prev = newColumn.tail
                state[newColumnIndex].cards[newColumn.tail].next = card.id
            }
            card.next = null
            newColumn.cards[card.id] = card
            newColumn.tail = card.id
        },
        moveCardToIndex(
            state,
            action: PayloadAction<{
                card: Card
                toIndex: number
                toColumnType: string
            }>
        ) {
            // moves card from one column to another column at particular index
            const { card, toIndex, toColumnType } = action.payload
            const toColumnIndex = state.findIndex(
                (b) => b.name === toColumnType
            )
            if (toColumnIndex === -1) {
                throw new Error('To column not found')
            }
            const toColumn = state[toColumnIndex]
            const destCard = findNthCard(toColumn.cards, toColumn.head, toIndex)
            if (destCard === null) {
                return
            }
            if (destCard.prev === null) {
                card.prev = null
                state[toColumnIndex].head = card.id
            } else {
                card.prev = destCard.prev
                state[toColumnIndex].cards[destCard.prev].next = card.id
            }
            card.next = destCard.id
            state[toColumnIndex].cards[destCard.id].prev = card.id
            state[toColumnIndex].cards[card.id] = card
        },
    },
})

export default columnsSlice.reducer

export const { moveCardToIndex } = columnsSlice.actions

export const addColumn =
    (payload: string, cb: () => void): AppThunk =>
    async (dispatch) => {
        dispatch(columnsSlice.actions.addColumn(payload))
        cb()
    }

export const deleteColumn =
    (payload: string, cb: () => void): AppThunk =>
    async (dispatch) => {
        dispatch(columnsSlice.actions.deleteColumn(payload))
        cb()
    }

export const addCardToColumn =
    (payload: { name: string; card: Card }, cb: () => void): AppThunk =>
    async (dispatch) => {
        dispatch(columnsSlice.actions.addCardToColumn(payload))
        cb()
    }

export const editCard =
    (payload: { name: string; card: Card }, cb: () => void): AppThunk =>
    async (dispatch) => {
        dispatch(columnsSlice.actions.editCard(payload))
        cb()
    }

export const editAndMoveCard =
    (
        payload: { name: string; card: Card; newColumnType: string },
        cb: () => void
    ): AppThunk =>
    async (dispatch) => {
        dispatch(
            columnsSlice.actions.editCard({
                card: payload.card,
                name: payload.name,
            })
        )
        dispatch(
            columnsSlice.actions.deleteCard({
                cardId: payload.card.id,
                name: payload.name,
            })
        )
        dispatch(
            columnsSlice.actions.moveCard({
                ...payload,
                card: { ...payload.card },
            })
        )
        cb()
    }

export const deleteCard =
    (payload: { name: string; cardId: string }, cb: () => void): AppThunk =>
    async (dispatch) => {
        dispatch(columnsSlice.actions.deleteCard(payload))
        cb()
    }

export const getColumns = (state: RootState) => state.columns
