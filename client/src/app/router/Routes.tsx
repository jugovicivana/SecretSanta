import Register from "../../features/account/Register";
import Requests from "../../features/request/Requests";
import RequireAuth from "./RequireAuth";
import HomePage from "../../features/gift/HomePage";
import WithNavBar from "../layout/WithNavBar";
import App from "../layout/App";
import { createBrowserRouter } from "react-router-dom";
import Login from "../../features/account/Login";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/",
        element: <WithNavBar />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "/requests",
            element: (
              <RequireAuth>
                <Requests />
              </RequireAuth>
            ),
          },
        ],
      },
    ],
  },
]);
