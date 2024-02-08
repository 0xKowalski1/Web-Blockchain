import * as React from "react";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import RootPage from "./pages/Root.page";
import BlockchainNetwork from "./Blockchain/BlockchainNetwork";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
  },
]);

const App = () => {
  const blockchainNetwork = new BlockchainNetwork(3);

  return <RouterProvider router={router} />;
};

export default App;
