import Blockly from "blockly";
import type { Block } from "blockly/core";

// The root block. Contains a series of statements.
Blockly.Blocks["program"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField("program");

    this.appendStatementInput("statements").setCheck("statement");

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

Blockly.Blocks["string"] = {
  init: function (this: Block) {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput("type something here"),
      "text"
    );

    this.setOutput(true, null);
  },
};
