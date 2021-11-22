import React, { ReactElement } from "react"
import Editor, { useMonaco, loader } from "@monaco-editor/react"

interface Props {
  ref: React.MutableRefObject<typeof Editor>
}

export default function ActionEditor({ ref }: Props): ReactElement<Props> {
  function handleEditorDidMount(editor, monaco) {
    ref.current = editor
  }
  return <Editor defaultLanguage="typescript" />
}
