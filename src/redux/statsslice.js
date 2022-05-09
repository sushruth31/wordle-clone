import { createSlice } from "@reduxjs/toolkit"
import { getSavedData } from "../uselocalstoragestate"

const initialState = {
  numPlayed:
    getSavedData("stats", [], false)?.find(el => el.type === "numPlayed") ?? 0,
}

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    addNumPlayed: state => {
      state.numPlayed++
      localStorage.setItem("stats", state.numPlayed)
    },
  },
})

export const { saveStat } = statsSlice.actions

export default statsSlice.reducer
