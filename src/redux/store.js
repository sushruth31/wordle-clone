import { configureStore } from "@reduxjs/toolkit"
import statsReducer from "./statsslice"

export const store = configureStore({
  reducer: {
    stats: statsReducer,
  },
})
