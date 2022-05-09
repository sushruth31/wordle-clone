import { useState } from "react"

const isItANum = str => !isNaN(str)

const objectify = map => {
  let target = {}
  if (map instanceof Map) {
    map = Object.fromEntries(map)
  }

  for (let key of Object.keys(map)) {
    let val = map[key]
    if (typeof val === "object") {
      target[key] = objectify(val)
    } else {
      target[key] = val
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
    item = JSON.stringify(objectify(item))
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
