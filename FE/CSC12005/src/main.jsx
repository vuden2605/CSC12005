import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./components/AllRoutes/index.jsx";
import { store } from "./redux/store.jsx";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AllRoutes />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
