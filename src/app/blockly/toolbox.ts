export default `<xml id="toolbox" style="display: none">
  <!--
  Blockly.Blocks.variables.HUE = 330;
  Blockly.Blocks.colour.HUE = 20;
  Blockly.Blocks.lists.HUE = 260;
  Blockly.Blocks.logic.HUE = 65;
  Blockly.Blocks.loops.HUE = 120;
  Blockly.Blocks.math.HUE = 230;
  Blockly.Blocks.procedures.HUE = 290;
  Blockly.Blocks.texts.HUE = 160;
  Blockly.Blocks.variables.HUE = 330;
  Blockly.Blocks.firstmakers.HUE = 210
  -->

  <category name="CAT_CONTROL" colour="120">
    <block type="wait"></block>
    <block type="on_key"></block>
    <block type="controls_repeat_forever"></block>
    <block type="controls_repeat_ext">
        <value name="TIMES">
          <block type="math_number">
            <field name="NUM">3</field>
          </block>
        </value>
    </block>
    <block type="controls_whileUntil"></block>
  </category>
  <category name="CAT_LOGIC" colour="185">
    <block type="controls_if"></block>
    <block type="logic_compare"></block>
    <block type="logic_operation"></block>
    <block type="logic_boolean"></block>
    <block type="logic_negate"></block>
  </category>
  <category name="CAT_MATH" colour="230">
    <block type="math_number"></block>
    <block type="math_arithmetic"></block>
    <block type="math_random_float"></block>
    <block type="math_constant"></block>
    <block type="math_single"></block>

  </category>
  <category name="CAT_FIRSTMAKERS" colour="210" >
    <block type="light_on"></block>
    <block type="light_off"></block>
    <block type="buzzer_on"></block>
    <block type="buzzer_off"></block>

    <block type="potentiometer"></block>
    <block type="temperature_sensor"></block>
    <block type="light_sensor"></block>
    <block type="audio_sensor"></block>
    <block type="humidity_sensor"></block>
    <block type="infrared_sensor"></block>

    <block type="button"></block>
    <block type="digital_pin_on"></block>
    <block type="digital_pin_off"></block>
    <block type="analog_write">
      <value name="VALUE">
        <block type="math_number">
          <field name="NUM">100</field>
        </block>
      </value>
    </block>
    <block type="read_digital_pin"></block>
    <block type="read_analog_pin"></block>
    <block type="servo">
      <value name="ANGLE">
        <block type="math_number">
          <field name="NUM">180</field>
        </block>
      </value>
    </block>
    <block type="motor_config"></block>
    <block type="motor_speed">
      <value name="SPEED">
        <block type="math_number">
          <field name="NUM">100</field>
        </block>
      </value>
    </block>
    <block type="motor_direction"></block>



  </category>
  <category name="CAT_TEXT"  colour="160" >
     <block type="say">
        <value name="CONTENT">
          <block type="text">
            <field name="TEXT">MSG_HELLO</field>
          </block>
        </value>
     </block>
     <block type="text"></block>
     <block type="text_prompt"></block>
  </category>
  <category name="CAT_COLOR"  colour="20" >
     <block type="colour_picker"></block>
  </category>
  <category name="CAT_LISTS"  colour="260" >
     <block type="lists_repeat"></block>
     <block type="lists_create_with"></block>
  </category>
  <category name="CAT_INTERNET"  colour="100" >
     <block type="getXhr"></block>
  </category>
  <category name="CAT_VARIABLES" custom="VARIABLE" colour="330" ></category>
  <category name="CAT_FUNCTIONS" custom="PROCEDURE" colour="290" ></category>
</xml>`;
