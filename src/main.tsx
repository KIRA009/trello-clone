import React from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'
import { configuredStore } from './store'
import { createColumn } from './utils'

const store = configuredStore({
    columns: [
        createColumn('To Do'),
        createColumn('Doing'),
        createColumn('Done'),
    ],
})
const container = document.getElementById('root')
const root = createRoot(container as HTMLDivElement)

root.render(<App store={store} />)
