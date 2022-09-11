///<reference types="nodecg-types/types/browser"/>

import "./index.css";
import Iconify from "@iconify/iconify";
import { MantineProvider } from "@mantine/core";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

Iconify.scan();

createRoot(document.getElementById("root")).render(
  <MantineProvider
    withNormalizeCSS
    withGlobalStyles
    theme={{ colorScheme: "dark" }}
  >
    <App />
  </MantineProvider>
);
