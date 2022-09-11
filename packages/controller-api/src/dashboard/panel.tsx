import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./panel.css";

// 2. Add your color mode confi

ReactDOM.render(
  <MantineProvider
    withGlobalStyles
    withNormalizeCSS
    theme={{ colorScheme: "dark" }}
  >
    <App />
  </MantineProvider>,
  document.getElementById("root")
);
