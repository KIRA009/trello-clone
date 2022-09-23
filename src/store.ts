import type { Action, AnyAction } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import type { ThunkAction, ThunkDispatch } from 'redux-thunk'
import thunkMiddlware from 'redux-thunk'

import columnsReducer from './reducers/columns'

const persistConfig = {
    key: 'root',
    storage,
}
const rootReducer = combineReducers({
    columns: columnsReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configuredStore = (initialState?: RootState) => {
    // Create Store
    return configureStore({
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [
                        FLUSH,
                        REHYDRATE,
                        PAUSE,
                        PERSIST,
                        PURGE,
                        REGISTER,
                    ],
                },
            }).concat(thunkMiddlware),
        preloadedState: initialState,
        reducer: persistedReducer,
    })
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
export type Store = ReturnType<typeof configuredStore>
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export type TypedDispatch = ThunkDispatch<RootState, any, AnyAction>
