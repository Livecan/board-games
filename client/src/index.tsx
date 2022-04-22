import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LoginContextProvider } from "./Context/LoginContext";

ReactDOM.hydrate(
  <BrowserRouter>
    <LoginContextProvider>
      <App />
    </LoginContextProvider>
  </BrowserRouter>,
  document.getElementById("app")
);
