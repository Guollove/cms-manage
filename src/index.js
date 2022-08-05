import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/base.less";
import App from "./router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
