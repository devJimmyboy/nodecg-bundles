import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
// const root = ReactDOM.createRoot(rootElement)

const theme: MantineThemeOverride = {
  colorScheme: "dark",
};

createRoot(rootElement).render(
  <MantineProvider theme={theme}>
    <App />
  </MantineProvider>
);
