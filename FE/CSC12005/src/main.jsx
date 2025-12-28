import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./components/AllRoutes/index.jsx";
import { store } from "./redux/store.jsx";
import { Provider } from "react-redux";
import {AlertProvider  } from "./context/AlertContext.jsx"
import AlertMessage from "./components/AlertMessage/AlertMessage.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AlertProvider>
    <BrowserRouter>
      <Provider store={store}>
            <AlertMessage />

        <AllRoutes />
      </Provider>
    </BrowserRouter>
    </AlertProvider>
  </StrictMode>
);
