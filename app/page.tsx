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
  ],
};

export default function Home() {
  const blocklyAreaRef = useRef<HTMLDivElement>(null);
  const blocklyDivRef = useRef<HTMLDivElement>(null);

  let workspace: Blockly.WorkspaceSvg;

  const [output, setOutput] = useState<string>("");

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
      <p id="output" className="flex-none h-72">
        {output}
      </p>
    </div>
  );
}
