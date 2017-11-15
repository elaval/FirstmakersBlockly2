import { HttpClient } from '@angular/common/http';
import { BlocklyService } from './blockly.service';
import { Component, OnInit } from '@angular/core';
import toolboxXML from './toolbox';
import msgsEN from './messages/en';
import msgsES from './messages/es';

import Blockly from 'node-blockly/browser';

const startupScript2 = `
<xml>
<variables></variables>
<block type="light_on" id="h9H=[pZ+sJ}_t58Wi}h{" x="70" y="70">
<field name="COLOR_PIN">13</field>
<next>
<block type="wait" id="O('Cd|@9l_LfG.-$|'3w">
<field name="VALUE">1</field>
<next>
<block type="light_off" id="@e/#t~%@4P@-Vj-pl+pv">
<field name="COLOR_PIN">13</field>
</block>
</next>
</block>
</next>
</block>
</xml>
`;

const startupScript = `
<xml>
<block type="light_on" deletable="true" x="70" y="70"></block>
<block type="light_off" deletable="true" x="70" y="90"></block>
</xml>
`;

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.css']
})
export class BlocklyComponent implements OnInit {

  constructor(
    private blocklyService: BlocklyService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    let editor;
    // msgsEN();
    msgsES();

    let code = Blockly.Xml.textToDom(startupScript);

    // let code = document.getElementById('startBlocks');

    const render = (element) => {
      return new Promise((resolve, reject) => {
        if ( editor ) {
          editor.removeChangeListener(updateCode);
          code = Blockly.Xml.workspaceToDom(editor);
          editor.dispose();
        }

        this.blocklyService.translateToolboxCategories(toolboxXML)
        .then(toolboxXML => {
          editor = Blockly.inject(element, {
            toolbox: toolboxXML
          });

          this.blocklyService.setEditor(editor);

          Blockly.Xml.domToWorkspace(code, editor);

          editor.addChangeListener(updateCode.bind(this));

          resolve(editor);
        });
      })



    };

    function updateCode() {
      this.blocklyService.newCodeJavascript(Blockly.JavaScript.workspaceToCode(editor));
      // document.getElementById('js').innerText = Blockly.JavaScript.workspaceToCode(editor);
      // document.getElementById('php').innerText = Blockly.PHP.workspaceToCode(editor);
      // document.getElementById('lua').innerText = Blockly.Lua.workspaceToCode(editor);
      // document.getElementById('dart').innerText = Blockly.Dart.workspaceToCode(editor);
      // document.getElementById('python').innerText = Blockly.Python.workspaceToCode(editor);
    }

    render('editor')
    .then( _editor => editor = _editor);

    updateCode();

    console.log(code);
  }

}
