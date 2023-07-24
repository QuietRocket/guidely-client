import Blockly from "blockly";
import type { Block } from "blockly/core";

// The root block. Contains a series of statements.
Blockly.Blocks["program"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField("program");

    this.appendStatementInput("statements");

    this.setColour("#be1010");
  },
};

Blockly.Blocks["statement"] = {
  init: function (this: Block) {
    this.appendValueInput("VALUE").setCheck(null).appendField("statement");

    this.setPreviousStatement(true, "statement");
    this.setNextStatement(true, "statement");

    this.setColour("#0f538a");
  },
};

Blockly.Blocks["instruction"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField("instruction");

    this.appendStatementInput("statements");

    this.setPreviousStatement(true, "statement");
    this.setNextStatement(true, "statement");

    this.setColour("#0f538a");
  },
};

Blockly.Blocks["system"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField("system");

    this.appendStatementInput("statements");

    this.setPreviousStatement(true, "statement");
    this.setNextStatement(true, "statement");

    this.setColour("#0f538a");
  },
};

Blockly.Blocks["string"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput("type something here"),
      "text"
    );

    this.setOutput(true, null);
  },
};

Blockly.Blocks["newline"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField("newline");

    this.setPreviousStatement(true, "statement");
    this.setNextStatement(true, "statement");
  },
};

Blockly.Blocks["each"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField("each");

    this.appendValueInput("list").setCheck(null).appendField("list");

    this.appendStatementInput("statements");

    this.setPreviousStatement(true, "statement");
    this.setNextStatement(true, "statement");

    this.setColour("#198209");
  },
};

Blockly.Blocks["gen"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField("gen");

    this.setPreviousStatement(true, "statement");
    this.setNextStatement(true, "statement");

    this.setColour("#198209");
  },
};
