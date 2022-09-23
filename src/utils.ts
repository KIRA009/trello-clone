import type { Card } from './types/card'
import type { Column } from './types/column'

export const createCard = (title: string, description: string): Card => {
    return {
        description,
        id: '',
        next: null,
        prev: null,
        title,
    }
}

export const createColumn = (name: string): Column => {
    return {
        cards: {},
        head: null,
        name,
        tail: null,
    }
}

export const getCardList = (
    cards: { [id: string]: Card },
    head: string | null
): Card[] => {
    const cardList: Card[] = []
    let currentCard = head
    while (currentCard !== null) {
        cardList.push(cards[currentCard])
        currentCard = cards[currentCard].next
    }
    return cardList
}

export const findNthCard = (
    cards: { [id: string]: Card },
    head: string | null,
    n: number
): Card | null => {
    let currentCard = head
    let i = 0
    while (currentCard !== null) {
        if (i === n) {
            return cards[currentCard]
        }
        currentCard = cards[currentCard].next
        i++
    }
    return null
}
