import { createSlice } from "@reduxjs/toolkit"
import { getSavedData } from "../uselocalstoragestate"

const defaultState = {
  numPlayed: 0,
}

const simpleGetter = (slice, prop) => {
  return (
    getSavedData("state", defaultState, false)?.[slice][prop] ??
    defaultState[prop]
  )
}

const initialState = {
  numPlayed: simpleGetter("stats", "numPlayed"),
}

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    addNumPlayed: state => {
      state.numPlayed = Number(state.numPlayed) + 1
    },
    resetStats: state => {
      state = defaultState
    },
  },
})

export const { resetStats, addNumPlayed } = statsSlice.actions

//selectors
export const getNumPlayed = state => state.stats.numPlayed

export default statsSlice.reducer
