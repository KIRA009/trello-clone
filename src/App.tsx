import { MantineProvider } from '@mantine/core'
import React from 'react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import Board from './components/Board'
import type { Store } from './store'

type Props = {
    store: Store
}

const App: React.FC<Props> = ({ store }) => {
    const persistor = persistStore(store)

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <MantineProvider>
                    <Board />
                </MantineProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
