import {configureStore} from "@reduxjs/toolkit"
import goalReducer from "./features/goalSlice"
import authReducer from "./features/authSlice"

export const store = configureStore({
    reducer:{
        goal:goalReducer,
        auth:authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch