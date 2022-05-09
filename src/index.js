import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { store } from "./redux"
import { Provider } from "react-redux"

document.body.style = "background: #131214"

window.store = store

function saveData(state) {
  localStorage.setItem("state", JSON.stringify(state))
}

//update local storage
store.subscribe(() => saveData(store.getState()))

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)
