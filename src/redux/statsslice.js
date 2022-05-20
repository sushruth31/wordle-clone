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

export function addWinThunk() {
  return (dispatch, getState) => {
    //only add win when numplayed > 0
    let numPlayed = getState().stats.numPlayed
    if (numPlayed > 0) {
      dispatch(statsSlice.actions.addWin())
    }
  }
}

export const actions2 = statsSlice.actions

//selectors
export const getNumPlayed = state => state.stats.numPlayed

export default statsSlice.reducer
