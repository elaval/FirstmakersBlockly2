import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import Blockly from 'node-blockly/browser';
import BocksDefinition from './blocks.definitions';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class BlocklyService {
  editor: any;
  codeJavascriptSubject = new BehaviorSubject(null);
  codeJavascript = this.codeJavascriptSubject.asObservable();

  constructor(
    private translate: TranslateService
  ) {
    BocksDefinition();
  }

  newCodeJavascript(code) {
    this.codeJavascriptSubject.next(code);
  }

  setEditor(editor) {
    this.editor = editor;
  }

  higlightBlock(id) {
    if (this.editor && this.editor.highlightBlock) {
      this.editor.highlightBlock(id);
    } else {
      console.error('NO DEFINIDO', this.editor);
    }

  }


    /**
     * Translates names of toolbox categories
     * Returns a promise to the translated xml text
     */
  translateToolboxCategories(toolboxText) {

    const resolver = (resolve, reject) => {

      const xml = Blockly.Xml.textToDom(toolboxText);

      const translationPromises = [];

      // Transtale name attributes in toolbox definition
      // Ej <category name="CAT_TEXT">
      _.each(xml.getElementsByTagName('category'), (node) => {
          translationPromises.push(this.translateNodeName(node));
      });

      // Transtale TEXT field content in toolbox definition
      // Ej <field name="TEXT">MY_CONTENT</field>

      _.each($(xml).find("field[name='TEXT']"), (node) => {
          translationPromises.push(this.translateNodeText(node));
      });


      Promise.all(translationPromises)
      .then(function(res) {
          console.log(res);
          const newToolboxText = Blockly.Xml.domToText(xml);
          resolve(newToolboxText);
      })
      .catch(function(err) {
        console.log(err);
      });

    };


    return new Promise(resolver);

  }

  /**
   * Translate the name attribute of an xml node
   * Returns a promise to the translated node
   */
   translateNodeName(node) {
    const resolver = (resolve, reject) => {
      const originalName = node.getAttribute('name');
      this.translate.get(originalName)
      .subscribe((translatedName) => {
          node.setAttribute('name', translatedName);
          resolve(node);
      },
      (err) => {
        reject(err);
      }
      );
    };


    return new Promise(resolver);
  }

  /**
   * Translate the name attribute of an xml node
   * Returns a promise to the translated node
   */
  translateNodeText(node) {
    const resolver = (resolve, reject) => {

      const originalText = $(node).text();
      this.translate.get(originalText)
      .subscribe(
        (translatedText) => {
            $(node).text(translatedText);
            resolve(node);
        },
        (err) => reject(err)
      );


    };

    return new Promise(resolver);
  }

}
