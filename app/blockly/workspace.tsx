import Blockly from "blockly";

import "./blocks";
import { toolbox } from "./toolbox";
import { generator } from "./generator";

import { useEffect, useRef } from "react";

type Props = {
  onGenerate: (output: string) => void;
};

export default function Workspace({ onGenerate }: Props): JSX.Element {
  const blocklyAreaRef = useRef<HTMLDivElement>(null);
  const blocklyDivRef = useRef<HTMLDivElement>(null);

  let workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  const onResize = () => {
    if (!blocklyAreaRef.current || !blocklyDivRef.current) return;

    const blocklyArea = blocklyAreaRef.current.getBoundingClientRect();
    const { x, y, width, height } = blocklyArea;

    blocklyDivRef.current.style.left = `${x}px`;
    blocklyDivRef.current.style.top = `${y}px`;
    blocklyDivRef.current.style.width = `${width}px`;
    blocklyDivRef.current.style.height = `${height}px`;

    if (workspace.current) {
      Blockly.svgResize(workspace.current);
    }
  };

  useEffect(() => {
    workspace.current = Blockly.inject(blocklyDivRef.current!, {
      toolbox: toolbox,
    });

    const workspaceState = localStorage.getItem("workspace");
    if (workspaceState) {
      Blockly.serialization.workspaces.load(
        JSON.parse(workspaceState),
        workspace.current
      );
    }

    workspace.current.addChangeListener(() => {
      onGenerate(generator.workspaceToCode(workspace.current!));

      const state = Blockly.serialization.workspaces.save(workspace.current!);
      localStorage.setItem("workspace", JSON.stringify(state));
    });

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      workspace.current?.dispose();
    };
  }, [onGenerate]);

  return (
    <>
      <div
        id="blocklyArea"
        ref={blocklyAreaRef}
        className="flex-initial h-full"
      />
      <div id="blocklyDiv" ref={blocklyDivRef} className="absolute" />
    </>
  );
}
