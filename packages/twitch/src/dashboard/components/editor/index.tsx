import { Box, Button, Checkbox, Flex, Spinner, Textarea } from "@chakra-ui/react"
import Editor, { Monaco, useMonaco } from "@monaco-editor/react"
import { editor } from "monaco-editor"
import React, { ReactElement, useEffect, useRef } from "react"
import { useReplicant } from "use-nodecg"
import addThemes from "./monaco/theme"
const initialEditorText = `/*
    Sub Goal Class Names:
    #wrapper
        #goalW
            #goal
                .goal-progress
                .goal-name
                .goal-goal .active
            #infoHolder
                .current-subs
*/
/* comment this out to disable custom css */\n.enable-custom {\n\t\n}\n`
interface Props {}

export default function CustomCSS({}: Props): ReactElement {
  const [errored, setErrored] = React.useState(false)
  const [cssVal, setCss] = useReplicant<{ css: string; enabled: boolean }, null>("originalCss", null, {
    defaultValue: { css: initialEditorText, enabled: false },
    persistent: true,
  })
  const setCssVal = (val: string) => setCss({ css: val, enabled: cssVal.enabled })
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null)
  const monaco = useMonaco()

  useEffect(() => {
    // do conditional chaining

    // or make sure that it exists by other ways
    if (monaco) {
      addThemes(monaco)

      console.log("here is the monaco instance:", monaco)
    }
  }, [monaco])

  useEffect(() => {
    nodecg.listenFor("parseCssFinished", setErrored)
    return () => {
      nodecg.unlisten("parseCssFinished", setErrored)
    }
  }, [])
  function handleEditorDidMount(editor, monaco: Monaco) {
    monaco.languages.css.cssDefaults.setOptions({ validate: false })
    editorRef.current = editor
  }

  let updateCss = () => {
    let inputValue = editorRef.current.getValue()
    setCssVal(inputValue)
    window.nodecg.sendMessage("parseCss", inputValue)
  }
  if (cssVal === null) return <Spinner color="teal" size="xl" />
  else
    return (
      <Flex w="100%" direction="column" className="rounded-lg">
        <Box className="bg-base-200 text-base-content m-2 p-2 rounded flex flex-col items-center">
          <Checkbox isChecked={cssVal.enabled} onChange={(e) => setCss({ enabled: e.target.checked, css: cssVal.css })}>
            Enable Custom CSS
          </Checkbox>
        </Box>
        <Editor
          height="350px"
          language="css"
          onMount={handleEditorDidMount}
          defaultValue={cssVal.css}
          options={{ fontFamily: "Fira Code", fontSize: 16 }}
          theme="tw-dark"
          loading={<Spinner color="teal" size="xl" />}
        />
        <Button onClick={updateCss}>Submit CSS</Button>
      </Flex>
    )
}
