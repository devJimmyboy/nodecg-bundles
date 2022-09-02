///<reference types="nodecg-types/types/browser"/>

import Iconify from "@iconify/iconify";
import { MantineProvider } from "@mantine/core";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

Iconify.scan();

createRoot(document.getElementById("root")).render(
  <MantineProvider theme={{ colorScheme: "dark" }}>
    <App />
  </MantineProvider>
);
