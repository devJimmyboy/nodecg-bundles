import ts from "typescript";
import { NodeCG } from "nodecg-types/types/server";
import { ModuleKind, ScriptTarget } from "typescript";

interface Source {
  name: string;
  path?: string;
  url?: string;
  text?: string;
  target?: ScriptTarget;
  module?: ModuleKind;
  tsx?: boolean;
  compilerOptions?: ts.CompilerOptions;
}
// const defaultCompilerHost = ts.createCompilerHost({
//   target: ts.ScriptTarget.ESNext,
//   module: ts.ModuleKind.CommonJS,
//   moduleResolution: ts.ModuleResolutionKind.NodeJs,
// });

// const printer = ts.createPrinter();
export default function (nodecg: NodeCG) {
  nodecg.log.info("Initializing TypeScript Compiler");

  nodecg.listenFor("compile:ts", (data: Source, cb) => {
    const transpiledCode = ts.transpileModule(data.text, {
      compilerOptions: {
        target: data.target || ts.ScriptTarget.ESNext,
        module: data.module || ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        jsx: data.tsx ? ts.JsxEmit.React : ts.JsxEmit.None,
        ...data.compilerOptions,
      },
    });
    if (cb && cb.handled === false) cb(transpiledCode.outputText);
  });
}
