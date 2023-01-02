/// <reference types="nodecg-types/types/browser"/>

import React from "react";
import ReactDOM from "react-dom/client";
import {
  Button,
  Center,
  Code,
  Group,
  Loader,
  MantineProvider,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import ts from "typescript";
// import Editor from "./components/Editor";
const Editor = React.lazy(() => import("./components/Editor"));

interface Source {
  name: string;
  path?: string;
  url?: string;
  text?: string;
  target?: ts.ScriptTarget;
  module?: ts.ModuleKind;
  tsx?: boolean;
  compilerOptions?: ts.CompilerOptions;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
document.getElementById("root").style.height = "100vh";

root.render(
  <MantineProvider theme={{ colorScheme: "dark" }}>
    <React.Suspense fallback={<Loader />}>
      <App />
    </React.Suspense>
  </MantineProvider>
);

function App() {
  const [value, setValue] = React.useState("");
  const [target, setTarget] = React.useState(ts.ScriptTarget.ESNext);
  const [module, setModule] = React.useState(ts.ModuleKind.ESNext);
  const [transpiledCode, setTranspiledCode] = React.useState("");
  const transpile = React.useCallback(() => {
    console.log("transpiling");
    const src: Source = {
      text: value,
      name: "test.ts",
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    };
    nodecg.sendMessage("compile:ts", src, (result: string) => {
      console.log("transpiled", result);
      setTranspiledCode(result.toString());
    });
  }, [value]);

  return (
    <Stack spacing={6} sx={{ maxHeight: 750, height: "100vh" }}>
      <Group>
        <Select
          value={module.toString()}
          onChange={(e) => setModule(parseInt(e) as ts.ModuleKind)}
          data={[
            {
              value: ts.ModuleKind.ESNext.toString(),
              label: "ESNext",
            },
            {
              value: ts.ModuleKind.CommonJS.toString(),
              label: "CommonJS",
            },
            {
              value: ts.ModuleKind.ES2015.toString(),
              label: "ES2015",
            },
            {
              value: ts.ModuleKind.ES2020.toString(),
              label: "ES2017",
            },
            {
              value: ts.ModuleKind.NodeNext.toString(),
              label: "NodeNext",
            },
          ]}
        />
        <Select
          value={target.toString()}
          onChange={(e) => setTarget(parseInt(e) as ts.ScriptTarget)}
          data={[
            {
              value: ts.ScriptTarget.ESNext.toString(),
              label: "ESNext",
            },
            {
              value: ts.ScriptTarget.ES2020.toString(),
              label: "ES2020",
            },
            {
              value: ts.ScriptTarget.ES2015.toString(),
              label: "ES2015",
            },
            {
              value: ts.ScriptTarget.ES5.toString(),
              label: "ES5",
            },
            {
              value: ts.ScriptTarget.Latest.toString(),
              label: "Latest",
            },
          ]}
        />
      </Group>
      <Editor
        onChange={(code) => {
          setValue(code);
        }}
      />
      <Code
        sx={{
          width: "100%",
          height: 450,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {transpiledCode.split("\n").flatMap((line, i) => [line, <br />])}
      </Code>
      <Button.Group>
        <Button
          variant="default"
          onClick={(e) => {
            e.preventDefault();
            eval(transpiledCode);
          }}
        >
          Run
        </Button>
        <Button variant="default" onClick={transpile}>
          Compile
        </Button>
      </Button.Group>
    </Stack>
  );
}
