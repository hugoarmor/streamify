import { createBrowserRouter } from "react-router-dom";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <h1>Files</h1> },
      { path: "cluster", element: <h1>Cluster</h1> },
      { path: "settings", element: <h1>Settings</h1> },
    ]
  },
]);
