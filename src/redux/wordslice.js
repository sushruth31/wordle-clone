import { createSlice } from "@reduxjs/toolkit"

export const wordSlice = createSlice({
  name: "word",
  initialState: null,
  reducers: {
    newWord: (state, action) => {
      const { word, exp } = action.payload
      state.word = word
      state.exp = exp
    },
  },
})

export const actions1 = wordSlice.actions

export default wordSlice.reducer
