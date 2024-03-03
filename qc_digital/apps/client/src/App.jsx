import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./components/Body";
import { store } from "./store";

import "./App.css";
import { useEffect } from "react";

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
  },
]);

const App = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) =>
          console.log("Service worker registered!", registration.scope)
        )
        .catch((error) =>
          console.error("Service worker registration failed:", error)
        );
    }
  }, []);
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
};

export default App;
