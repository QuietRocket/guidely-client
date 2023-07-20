import Blockly from "blockly";
import type { Block } from "blockly/core";

export const generator = new Blockly.CodeGenerator("Blockly");

generator.forBlock["program"] = function (
  block: Block,
  generator: Blockly.CodeGenerator
) {
  return generator.statementToCode(block, "statements");
};

generator.forBlock["statement"] = function (
  block: Block,
  generator: Blockly.CodeGenerator
) {
  return (
    (generator.blockToCode(
      block.getInput("VALUE")?.connection?.targetBlock() ?? null
    ) as string) + generator.blockToCode(block.getNextBlock())
  );
};

generator.forBlock["string"] = function (
  block: Block,
  generator: Blockly.CodeGenerator
) {
  return block.getFieldValue("text");
};
