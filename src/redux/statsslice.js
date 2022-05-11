import { createSlice } from "@reduxjs/toolkit"
import { getSavedData } from "../uselocalstoragestate"

const defaultState = {
  numPlayed: 0,
  someOtherStat: 0,
}

//go through each key and try to retrieve from localstore in state obj.
function rehydrateState() {
  let target = { ...defaultState }
  for (let key in defaultState) {
    let newVal = getSavedData("state", undefined, false)?.stats?.[key]
    if (newVal) {
      target[key] = newVal
    }
  }

  return target
}

export const statsSlice = createSlice({
  name: "stats",
  initialState: rehydrateState(),
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
