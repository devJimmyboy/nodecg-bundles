import React from "react";
import Editor, {
  useMonaco,
  loader,
  OnChange,
  BeforeMount,
  OnMount,
  OnValidate,
} from "@monaco-editor/react";

interface Props {
  onChange?: (value: string) => void;
}
import { Loader } from "@mantine/core";

export default function TSEditor({ onChange }: Props) {
  const editorRef = React.useRef<Parameters<OnMount>[0]>(null);

  const handleEditorChange: OnChange = (value, event) => {
    // here is the current value
    // console.log(value);
    if (onChange) onChange(value);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    console.log("onMount: the editor instance:", editor);
    console.log("onMount: the monaco instance:", monaco);
  };

  const handleEditorWillMount: BeforeMount = (monaco) => {
    console.log("beforeMount: the monaco instance:", monaco);
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  const handleEditorValidation: OnValidate = (markers) => {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  };

  return (
    <Editor
      height="50%"
      defaultLanguage="typescript"
      defaultValue="// some comment"
      loading={<Loader size={50} />}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      beforeMount={handleEditorWillMount}
      onValidate={handleEditorValidation}
    />
  );
}
