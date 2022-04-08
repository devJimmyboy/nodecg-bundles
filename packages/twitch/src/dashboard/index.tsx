import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
// const root = ReactDOM.createRoot(rootElement)

const theme = extendTheme()

createRoot(rootElement).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
)
