import React, { ReactElement } from "react"
// import Editor, { useMonaco, loader } from "@monaco-editor/react"
import { Spinner } from "@chakra-ui/react"

interface Props {
  // ref: React.MutableRefObject<typeof Editor>
}

export default React.forwardRef(function (props, ref) {
  function handleEditorDidMount(editor, monaco) {
    ref = editor
  }
  return (
    <>
      {/* <Editor
        height="350px"
        language="css"
        onMount={handleEditorDidMount}
        defaultValue="/* some comment *\/"
        options={{ fontFamily: "Fira Code", fontSize: 16 }}
        loading={<Spinner color="teal" size="xl" />}
      /> */}
    </>
  )
})
