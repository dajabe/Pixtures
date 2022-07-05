import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: true,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isLoading = !state.isLoading
    },
    setFalse: (state) => {
      state.isLoading = false
    },
    setTrue: (state) => {
      state.isLoading = true
    },
    setState: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { toggle, setFalse, setTrue, setState } = loadingSlice.actions
export default loadingSlice.reducer
