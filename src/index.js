import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { store } from "./redux"
import { Provider } from "react-redux"

document.body.style = "background: #131214"
window.store = store //debugging

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)
