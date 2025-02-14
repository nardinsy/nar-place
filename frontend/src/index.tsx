import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/auth-context";
import { BackendContextProvider } from "./contexts/backend-service-context";
import { ToastServiceContexProvider } from "./contexts/toast-service-context";
// import ErrorContextProvider from "./contexts/error-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <ToastServiceContexProvider>
      {/* <ErrorContextProvider> */}
      <BackendContextProvider>
        {/* <LocalBackendContextProvider> */}
        <AuthContextProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </AuthContextProvider>
        {/* </LocalBackendContextProvider> */}
      </BackendContextProvider>
      {/* </ErrorContextProvider> */}
    </ToastServiceContexProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
