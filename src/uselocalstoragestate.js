import { useState } from "react";

const isItANum = str => !isNaN(str);

const objectify = map => {
  let target = {};
  if (map instanceof Map) {
    map = Object.fromEntries(map);
  }

  for (let key of Object.keys(map)) {
    let val = map[key];
    if (typeof val === "object") {
      target[key] = objectify(val);
    } else {
      target[key] = val;
    }
  }
  return target;
};

const mapify = obj => {
  //cannot do recursively
  let target = new Map();

  //  console.log(obj);

  for (let key of Object.keys(obj)) {
    target.set(isItANum(key) ? Number(key) : key, createMap(obj[key]));
  }

  function createMap(obj) {
    let innerMap = new Map();
    for (let key of Object.keys(obj)) {
      innerMap.set(isItANum(key) ? Number(key) : key, obj[key]);
    }

    return innerMap;
  }
  return target;
};

window.mapify = mapify;

export default function useLocalStorageState(key, initialState) {
  let item;

  try {
    item = mapify(JSON.parse(localStorage.getItem(key)));
    console.log(item);
  } catch {}

  const [state, setter] = useState(item instanceof Map ? item : initialState);

  const storeItem = item => {
    item = JSON.stringify(objectify(item));
    localStorage.setItem(key, item);
  };

  const newSetter = (newValOrCb, store) => {
    setter(state => {
      let newState = state;
      if (typeof newValOrCb === "function") {
        newState = newValOrCb(state);
      }
      if (store) storeItem(newState);
      return newState;
    });
  };

  return [state, newSetter];
}
