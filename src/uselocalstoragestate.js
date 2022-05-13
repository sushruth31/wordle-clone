import { useState } from "react"

const isItANum = str => !isNaN(str)

export const deepClone = (o, f = v => v) => {
  let target = {}
  o = o instanceof Map ? Object.fromEntries(o) : o

  for (let key of Object.keys(o)) {
    let val = o[key]
    if (typeof val === "object") {
      target[key] = f(deepClone(val), key)
    } else {
      target[key] = f(val, key)
    }
  }
  return target
}

const mapify = obj => {
  let target = new Map()

  for (let key of Object.keys(obj)) {
    target.set(isItANum(key) ? Number(key) : key, createMap(obj[key]))
  }

  function createMap(obj) {
    if (["ltr", "color"].some(key => key in obj)) {
      return obj
    }
    return mapify(obj)
  }
  return target
}

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
