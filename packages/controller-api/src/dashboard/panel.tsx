import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./panel.css";

// 2. Add your color mode confi

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{ colorScheme: "dark" }}
  >
    <App />
  </MantineProvider>
);
