import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/auth-context";
import { BackendContextProvider } from "./contexts/backend-service-context";
import { ToastContexProvider } from "./contexts/toast-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <ToastContexProvider>
      <BackendContextProvider>
        <AuthContextProvider>
          {/* <React.StrictMode> */}
          <App />
          {/* </React.StrictMode> */}
        </AuthContextProvider>
      </BackendContextProvider>
    </ToastContexProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
