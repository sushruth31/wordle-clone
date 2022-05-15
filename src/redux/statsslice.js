import { createSlice } from "@reduxjs/toolkit"

export const statsSlice = createSlice({
  name: "stats",
  initialState: null,
  reducers: {
    addNumPlayed: state => {
      state.numPlayed = Number(state.numPlayed) + 1
    },
    resetStats: state => {
      state.numPlayed = 0
      state.wins = 0
    },
    addWin: state => {
      state.wins = Number(state.wins) + 1
    },
  },
})

export const actions = statsSlice.actions

//selectors
export const getNumPlayed = state => state.stats.numPlayed

export default statsSlice.reducer
