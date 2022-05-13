import { combineReducers, configureStore } from "@reduxjs/toolkit"
import statsReducer from "./statsslice"
import { deepClone } from "../uselocalstoragestate"
import { getSavedData } from "../uselocalstoragestate"

const persistStore = store => next => action => {
  let result = next(action)
  try {
    localStorage.setItem("state", JSON.stringify(store.getState()))
  } catch {}
  return result
}

const initialState = {
  stats: {
    numPlayed: 0,
    someOtherState: 0,
  },
  someOtherProp: {
    blah: 10,
  },
}

//go through each key and try to retrieve from localstore in state obj.
function rehydrateState(state) {
  return deepClone(state, (_, key) => {
    return getSavedData("state", undefined, false)?.[key]
  })
}

export const store = configureStore({
  reducer: combineReducers({ stats: statsReducer }),
  preloadedState: rehydrateState(initialState),
  middleware: () => [persistStore],
})
