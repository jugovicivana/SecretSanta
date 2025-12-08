import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { router } from "./app/router/Routes.tsx";
import { store } from "./app/store/configureStore.ts";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
