"use client";

import Blockly from "blockly";
import { useEffect, useRef } from "react";

const toolbox = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "block",
      type: "controls_if",
    },
    {
      kind: "block",
      type: "controls_repeat_ext",
    },
    {
      kind: "block",
      type: "logic_compare",
    },
    {
      kind: "block",
      type: "math_number",
    },
    {
      kind: "block",
      type: "math_arithmetic",
    },
    {
      kind: "block",
      type: "text",
    },
    {
      kind: "block",
      type: "text_print",
    },
  ],
};

export default function Home() {
  const blocklyAreaRef = useRef<HTMLDivElement>(null);
  const blocklyDivRef = useRef<HTMLDivElement>(null);
  let workspace: any;

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

    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="w-screen h-screen">
      <div id="blocklyArea" ref={blocklyAreaRef} className="w-full h-full" />
      <div id="blocklyDiv" ref={blocklyDivRef} className="absolute" />
    </div>
  );
}
