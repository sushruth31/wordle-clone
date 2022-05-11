import { configureStore } from "@reduxjs/toolkit"
import statsReducer from "./statsslice"

const persistStore = store => next => action => {
  let result = next(action)
  try {
    localStorage.setItem("state", JSON.stringify(store.getState()))
  } catch {}
  return result
}

export const store = configureStore({
  reducer: {
    stats: statsReducer,
  },
  middleware: () => [persistStore],
})
