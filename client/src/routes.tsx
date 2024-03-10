import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/root";
import { FilesLayout } from "./layouts/root/files";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <FilesLayout />},
      { path: "cluster", element: <h1>Cluster</h1> },
      { path: "settings", element: <h1>Settings</h1> },
    ]
  },
]);
