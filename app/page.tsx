"use client";

import Blockly from "blockly";
import "./blocks";
import { useState, useEffect, useRef } from "react";

import { generator } from "./generator";

const toolbox = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "block",
      type: "program",
    },
    {
      kind: "block",
      type: "statement",
    },
    {
      kind: "block",
      type: "instruction",
    },
    {
      kind: "block",
      type: "string",
    },
    {
      kind: "block",
      type: "newline",
    },
    {
      kind: "block",
      type: "each",
    },
  ],
};

export default function Home() {
  const blocklyAreaRef = useRef<HTMLDivElement>(null);
  const blocklyDivRef = useRef<HTMLDivElement>(null);

  let workspace: Blockly.WorkspaceSvg;

  const [output, setOutput] = useState<string>("");
  const [executed, setExecuted] = useState<string>("");
  const [live, setLive] = useState<boolean>(false);

  const onResize = () => {
    if (!blocklyAreaRef.current || !blocklyDivRef.current) return;

    const blocklyArea = blocklyAreaRef.current.getBoundingClientRect();
    const { x, y, width, height } = blocklyArea;

    blocklyDivRef.current.style.left = `${x}px`;
    blocklyDivRef.current.style.top = `${y}px`;
    blocklyDivRef.current.style.width = `${width}px`;
    blocklyDivRef.current.style.height = `${height}px`;

    Blockly.svgResize(workspace);
  };

  const updateExecuted = async () => {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ program: output }),
    });

    const responseJson = await response.json();

    setExecuted(responseJson["result"]);
  };

  useEffect(() => {
    if (!live) return;

    updateExecuted();
  }, [output, live]);

  useEffect(() => {
    workspace = Blockly.inject(blocklyDivRef.current!, {
      toolbox: toolbox,
    });

    const workspaceState = localStorage.getItem("workspace");
    if (workspaceState) {
      Blockly.serialization.workspaces.load(
        JSON.parse(workspaceState),
        workspace
      );
    }

    workspace.addChangeListener(() => {
      setOutput(generator.workspaceToCode(workspace));

      const state = Blockly.serialization.workspaces.save(workspace);
      localStorage.setItem("workspace", JSON.stringify(state));
    });

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      workspace.dispose();
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div
        id="blocklyArea"
        ref={blocklyAreaRef}
        className="flex-initial h-full"
      />
      <div id="blocklyDiv" ref={blocklyDivRef} className="absolute" />

      <div className="flex flex-row flex-none h-72">
        <div className="relative flex-initial w-1/2 h-full whitespace-pre-line">
          <p>{output}</p>
          <div className="absolute bottom-0 right-0 space-x-2 mb-3 mr-3">
            {!live && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={updateExecuted}
              >
                Run
              </button>
            )}

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setLive(!live);
              }}
            >
              {live ? "Stop" : "Live"}
            </button>
          </div>
        </div>
        <div className="flex-initial w-1/2 h-full whitespace-pre-line">
          <p>{executed}</p>
        </div>
      </div>
    </div>
  );
}
