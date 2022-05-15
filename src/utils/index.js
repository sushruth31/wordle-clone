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
