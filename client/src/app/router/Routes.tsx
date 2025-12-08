import Register from "../../features/account/Register";
import Requests from "../../features/request/Requests";
import RequireAuth from "./RequireAuth";
import HomePage from "../../features/gift/HomePage";
import WithNavBar from "../layout/WithNavBar";
import App from "../layout/App";
import { createBrowserRouter } from "react-router-dom";
import Login from "../../features/account/Login";
import Unauthorized from "../../components/error/Unauthorized";
import Forbidden from "../../components/error/Forbidden";
import BadRequest from "../../components/error/BadRequest";
import NotFound from "../../components/error/NotFound";

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
       { path: "/unauthorized", element: <Unauthorized /> },
      { path: "/forbidden", element: <Forbidden /> },
      { path: "/bad-request", element: <BadRequest /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
