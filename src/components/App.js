import React from "react";
import "./App.css";
import LobbyPage from "../api/LobbyPage";
import CodingGround from "../api/CodingGround";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

//TODO add config path file  instead of hardcoded paths
const router = createBrowserRouter([
  {
    path: "/",
    element: <LobbyPage />,
  },
  {
    path: "/editor",
    element: <CodingGround />,
  },
]);

const App = () => {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};



export default App;

