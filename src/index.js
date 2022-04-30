import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

document.body.style = "background: #131214";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
