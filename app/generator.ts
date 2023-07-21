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

generator.forBlock["instruction"] = function (
  block: Block,
  generator: Blockly.CodeGenerator
) {
  return (
    "[INST]" +
    generator.statementToCode(block, "statements") +
    "[/INST]" +
    generator.blockToCode(block.getNextBlock())
  );
};

generator.forBlock["string"] = function (
  block: Block,
  generator: Blockly.CodeGenerator
) {
  return block.getFieldValue("text");
};

generator.forBlock["newline"] = function (
  block: Block,
  generator: Blockly.CodeGenerator
) {
  return "\n" + generator.blockToCode(block.getNextBlock());
};

generator.forBlock["each"] = function (
  block: Block,
  generator: Blockly.CodeGenerator
) {
  return (
    "{{#each " +
    generator.blockToCode(
      block.getInput("list")?.connection?.targetBlock() ?? null
    ) +
    " }}" +
    generator.statementToCode(block, "statements") +
    "{{/each}}" + generator.blockToCode(block.getNextBlock())
  );
};
