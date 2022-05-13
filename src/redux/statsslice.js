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
      state.someOtherStat = 0
    },
  },
})

export const { resetStats, addNumPlayed } = statsSlice.actions

//selectors
export const getNumPlayed = state => state.stats.numPlayed

export default statsSlice.reducer
