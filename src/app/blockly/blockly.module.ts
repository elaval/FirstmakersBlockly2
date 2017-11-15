import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocklyService } from './blockly.service';
import { BlocklyComponent } from './blockly.component';
import { JavascriptInterpreterService } from './javascript-interpreter.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BlocklyComponent
  ],
  providers: [
    BlocklyService,
    JavascriptInterpreterService
  ],
  exports: [
    BlocklyComponent
  ]
})
export class BlocklyModule { }
