import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react"
import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import "./panel.css"

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
)
