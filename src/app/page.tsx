"use client";

import { type JSONContent } from "vanilla-jsoneditor";

import Workspace from "../components/blockly/workspace";
import { useState, useEffect } from "react";

import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export default function Home() {
  const [generated, setGenerated] = useState<string>("");
  const [variables, setVariables] = useState<JSONContent>({ json: {} });
  const [endpoint, setEndpoint] = useState<string>("");
  const [responseLlm, setResponseLlm] = useState<string>("");

  // Persistance of variables
  useEffect(() => {
    const localVariables = localStorage.getItem("variables");
    if (localVariables) {
      setVariables(JSON.parse(localVariables));
    }
  }, []);

  useEffect(() => {
    // Always make sure variables contains a json key
    if (!variables.json) {
      setVariables({ json: {} });
    }

    localStorage.setItem("variables", JSON.stringify(variables));
  }, [variables]);

  // Persistance of endpoint
  useEffect(() => {
    const localEndpoint = localStorage.getItem("endpoint");
    if (localEndpoint) {
      setEndpoint(localEndpoint);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("endpoint", endpoint);
  }, [endpoint]);

  // Fetch endpoint
  const fetchEndpoint = async () => {
    setResponseLlm("");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify({
        program: generated,
        variables: variables.json,
      }),
    });

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    const buffer = [];

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer.push(value);
      setResponseLlm(buffer.join(""));
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="m-2 flex justify-between items-center">
        <span className="font-semibold text-xl">Guidely</span>
        <div className="flex flex-row gap-3">
          <input
            type="text"
            placeholder="Endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="input input-bordered input-sm w-full max-w-xs"
          />
          <button className="btn btn-sm" onClick={fetchEndpoint}>
            Submit
          </button>
        </div>
      </div>
      <div className="flex-grow flex">
        <div className="flex-grow flex flex-col">
          <div className="flex-grow">
            <Workspace onGenerate={setGenerated} />
          </div>
          <div className="h-56 flex flex-row whitespace-pre-line mx-2">
            <div className="flex-1 overflow-scroll">{generated}</div>
            <div className="divider divider-horizontal" />
            <div className="flex-1 overflow-scroll">{responseLlm}</div>
          </div>
        </div>
        <div
          style={
            {
              "--jse-theme-color": "#383e42",
              "--jse-theme-color-highlight": "#545a5e",
            } as React.CSSProperties
          }
          className="w-96 flex-none"
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
