import React, { ReactElement } from "react"
import Editor, { useMonaco, loader } from "@monaco-editor/react"

interface Props {
  ref: React.MutableRefObject<typeof Editor>
}

export default React.forwardRef(function (props, ref) {
  function handleEditorDidMount(editor, monaco) {
    // ref = editor
  }
  return <Editor defaultLanguage="typescript" wrapperProps={{ ref: ref, ...props }} onMount={handleEditorDidMount} />
})
