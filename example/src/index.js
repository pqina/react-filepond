import React from "react";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// <18
// import ReactDOM from 'react-dom';
// ReactDOM.render(<App />, document.getElementById('root'));

// 18
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
