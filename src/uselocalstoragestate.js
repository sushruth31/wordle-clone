import { useState } from "react"
import { actions } from "./redux"
import { mapify, deepClone, useAction, findRandomWord } from "./utils"
import { myWordList } from "./wordlist"

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
  const newWord = useAction(actions.newWord)
  const storeItem = item => {
    item = JSON.stringify(deepClone(item))
    localStorage.setItem(key, item)
  }

  const clear = () => {
    setter(new Map())
    localStorage.removeItem(key)

    //remove word from redux state. update local store and dispatch new word action
    //temmp remove redux from local storage. middleware will add it back once dispatch is called
    localStorage.removeItem("state")
    newWord(findRandomWord(myWordList))
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
