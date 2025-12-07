import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import WithNavBar from "../layout/WithNavBar";
import HomePage from "../../features/home/HomePage";
import RequireAuth from "../../components/RequireAuth";
import Requests from "../../features/account/Requests";
// import HomePage from "../../features/home/HomePage";
// import WithNavBar from "../layout/WithNavBar";
// import Profile from "../../features/profile/Profile";
// import RequireAuth from "../components/RequireAuth";
// import UserRequests from "../../features/account/UserRequests";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
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
