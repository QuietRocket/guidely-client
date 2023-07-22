"use client";

import Editor from "./Editor";
import { type JSONContent } from "vanilla-jsoneditor";

import Workspace from "./blockly/workspace";
import { useState } from "react";

export default function Home() {
  const [generated, setGenerated] = useState<string>("");
  const [variables, setVariables] = useState<JSONContent>({ json: {} });

  return (
    <div className="h-screen flex flex-col">
      <div className="h-10 bg-purple-200">H</div>

      <div className="flex-grow flex">
        <div className="flex-grow flex flex-col">
          <div className="flex-grow">
            <Workspace onGenerate={setGenerated} />
          </div>
          <div className="h-56 flex flex-row whitespace-pre-line mx-2">
            <div className="flex-1">{generated}</div>
            <div className="divider divider-horizontal" />
            <div className="flex-1">
              {JSON.stringify(variables.json!, null, 2)}
            </div>
          </div>
        </div>
        <div
          style={
            {
              "--jse-theme-color": "#383e42",
              "--jse-theme-color-highlight": "#fff",
            } as React.CSSProperties
          }
          className="w-96 bg-red-200"
        >
          <Editor
            content={variables}
            onChange={(content) => {
              setVariables(content as JSONContent);
            }}
          />
        </div>
      </div>
    </div>
  );
}
