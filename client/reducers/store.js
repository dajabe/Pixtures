import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from '../reducers/loading'

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
  },
})
