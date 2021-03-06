import { useDispatch } from "react-redux"

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

export const promisify =
  f =>
  (...args) =>
    Promise.resolve(f(...args))

export const asyncStorage = {
  async getItem(key) {
    promisify(localStorage.getItem.bind(localStorage))(key)
  },
  async setItem(...args) {
    promisify(localStorage.setItem.bind(localStorage))(...args)
  },
}

const findRandomNumber = (max, min = 0) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const findRandomWord = wordList => {
  //need to return obj {word, exp}
  let curTime = new Date().getTime(),
    exp = curTime + 43200000,
    item

  const createWord = () => {
    let randIndex = Math.floor(Math.random() * wordList.length)
    let word = wordList[randIndex]
    let existingState
    try {
      existingState = JSON.parse(localStorage.getItem("state"))
    } catch {
      existingState = {}
    }
    localStorage.setItem(
      "state",
      JSON.stringify({ ...existingState, word: { word, exp } })
    )
    //wipe saved data when new word is created
    localStorage.removeItem("gridmap")
    return { word, exp }
  }

  try {
    item = JSON.parse(localStorage.getItem("state"))?.word
  } catch {
    return createWord()
  }

  //if no item assign new number

  if (!item?.word || curTime >= item?.exp) {
    return createWord()
  }

  return item
}

export const shuffle = arr => {
  let swappedIndexes = []
  for (let i = 0; i < arr.length; ++i) {
    let indexToSwap = findRandomNumber(arr.length - 1)
    swappedIndexes.push(indexToSwap)
    if (!swappedIndexes.includes(i)) {
      ;[arr[i], arr[indexToSwap]] = [arr[indexToSwap], arr[i]]
    }
  }
  return arr
}

export function useAction(action) {
  const dispatch = useDispatch()
  return (...args) => dispatch(action(...args))
}

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

const isItANum = str => !isNaN(str)

export const mapify = obj => {
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
