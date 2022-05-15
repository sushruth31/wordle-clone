import { useState } from "react"
import { mapify, deepClone } from "./utils"

export const getSavedData = (key, initialState, map = true) => {
  let item = initialState
  let transform = map ? mapify : val => val

  try {
    item = transform(JSON.parse(localStorage.getItem(key)))
  } catch (e) {
    //console.log("no local storage");
  }

  return item
}

export default function useLocalStorageState(key, initialState, fn) {
  const [state, setter] = useState(() => getSavedData(key, initialState))

  const storeItem = item => {
    item = JSON.stringify(deepClone(item))
    localStorage.setItem(key, item)
  }

  const clear = () => {
    setter(new Map())
    localStorage.removeItem(key)
    localStorage.removeItem("wordoftheday")
    typeof fn === "function" && fn()
  }

  const newSetter = (newValOrCb, store) => {
    setter(state => {
      let newState = state
      if (typeof newValOrCb === "function") {
        newState = newValOrCb(state)
      }
      if (store) storeItem(newState)
      return newState
    })
  }

  return [state, newSetter, clear]
}
