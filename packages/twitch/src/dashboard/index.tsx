import React from "react"
import ReactDOM from "react-dom"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"

import App from "./App"
const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")
// const root = ReactDOM.createRoot(rootElement)

const theme = extendTheme({ colors: require("daisyui/colors") })

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  rootElement
)
