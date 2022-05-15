import { combineReducers, configureStore } from "@reduxjs/toolkit"
import statsReducer from "./statsslice"
import { deepClone, asyncStorage } from "../utils"
import { getSavedData } from "../uselocalstoragestate"

const persistStore = store => next => action => {
  let result = next(action)
  try {
    //update store async
    asyncStorage.setItem("state", JSON.stringify(store.getState()))
  } catch {
    console.warn("data not saved")
  }
  return result
}

const initialState = {
  stats: {
    numPlayed: 0,
    wins: 0,
  },
}

//go through each key and try to retrieve from localstore in state obj.
function rehydrateState(state) {
  return deepClone(state, (v, key) => {
    let saved = getSavedData("state", undefined, false)?.[key]
    if (saved) {
      return saved
    }
    return v
  })
}

export const store = configureStore({
  reducer: combineReducers({ stats: statsReducer }),
  preloadedState: rehydrateState(initialState),
  middleware: () => [persistStore],
})
