import { asyncStorage } from "../utils"

export const persistStore = store => next => action => {
  let result = next(action)
  try {
    //update store async
    asyncStorage.setItem("state", JSON.stringify(store.getState()))
  } catch {
    console.warn("data not saved")
  }
  return result
}

export const thunkMiddleware =
  ({ dispatch, getState }) =>
  next =>
  action =>
    typeof action === "function" ? action(dispatch, getState) : next(action)
