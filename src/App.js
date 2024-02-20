import React from "react";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import RootPage from "./pages/Root.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
