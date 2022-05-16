import { store } from "./store"
import { actions2 } from "./statsslice"
import { actions1 } from "./wordslice"

const actions = { ...actions1, ...actions2 }

export { store, actions }
