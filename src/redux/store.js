import { combineReducers, configureStore } from "@reduxjs/toolkit"
import statsReducer from "./statsslice"
import { deepClone, asyncStorage, findRandomWord } from "../utils"
import { getSavedData } from "../uselocalstoragestate"
import { myWordList } from "../wordlist"
import wordReducer from "./wordslice"
import { thunkMiddleware, persistStore } from "./middleware"

export const NUM_ROWS = 6
export const NUM_COLS = 5

const initialState = {
  stats: {
    numPlayed: 0,
    wins: 0,
  },
  word: findRandomWord(myWordList),
}

//go through each key and try to retrieve from localstore in state obj.
//skip over word state as this has its own logic
function rehydrateState(state) {
  return deepClone(state, (v, key) => {
    if (key !== "word") {
      let saved = getSavedData("state", undefined, false)?.[key]
      return saved ? saved : v
    }
    return v
  })
}

export const store = configureStore({
  reducer: combineReducers({ stats: statsReducer, word: wordReducer }),
  preloadedState: rehydrateState(initialState),
  middleware: () => [persistStore, thunkMiddleware],
})
