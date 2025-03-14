import { createBrowserRouter } from "react-router-dom";
import { Home, Login, Logout, Profile, Setting, Signup } from "../Pages";
import Layout from "../layout/Layout";

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "logout", element: <Logout /> },
      { path: "profile", element: <Profile /> },
      { path: "setting", element: <Setting /> },
    ],
  },
]);
