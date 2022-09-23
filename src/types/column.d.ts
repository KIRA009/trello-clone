import type { Card } from './card'

export interface Column {
    name: string
    cards: {
        [id: string]: Card
    }
    head: string | null
    tail: string | null
}
