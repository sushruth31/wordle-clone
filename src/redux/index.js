import { store } from "./store"
import { actions2 } from "./statsslice"
import { actions1 } from "./wordslice"
import { addWinThunk } from "./statsslice"

const actions = { ...actions1, ...actions2, addWinThunk }

export { store, actions }
