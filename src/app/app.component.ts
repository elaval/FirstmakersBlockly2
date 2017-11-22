import { BlocklyService } from './blockly/blockly.service';
import { Component, NgZone } from '@angular/core';
import { BoardAgentService } from './board-agent/boardagent.service';
import { Board } from './board-agent/models/board';
import { LocalIpService } from './services/local-ip.service';
import * as io from 'socket.io-client';
import { JavascriptInterpreterService } from './blockly/javascript-interpreter.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tmpPins: any;
  code: any;
  javascriptCode: any;
  checkingHost: {};
  devices: any[];
  localIP: string;
  board: Board;
  title = 'app';
  port = 19675;

  currentBoardInfo = {
    board: null,
    pins: null
  };


  constructor(
    private boardAgentService: BoardAgentService,
    private localIpService: LocalIpService,
    private blocklyService: BlocklyService,
    private javascriptInterpreterService: JavascriptInterpreterService,
    private translate: TranslateService,
    private zone: NgZone
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('es');

    boardAgentService.board.subscribe((board: Board) => {
      this.board = board;
      this.javascriptInterpreterService.setBoard(board);
    });

    this.localIpService.checkPort('localhost', this.port)
    .then((res: any) => {
      if (res.status === 'open') {
        this.boardAgentService.connectToBoard('localhost');
        console.log('Connected to local machine');
      } else {
        alert('Not connected to local machine, will scan local network');
        this.localIP = '192.168.0.1';
        this.localIpService.checkPorts(this.localIP, this.port)
        .then((devices: any[]) => {
          this.devices = devices;
          if (this.devices.length > 0) {
            this.boardAgentService.connectToBoard(devices[0]);
          }
        });

        this.localIpService.checkingHost.subscribe((host) => {
          this.checkingHost = host;
        });
      }

    });

    this.blocklyService.codeJavascript.subscribe((code) => {
      if (code) {
        this.code = code;
        this.javascriptCode = code;
      }

    });
  }

  runCode() {
    this.javascriptInterpreterService.runCode(this.code);
  }

  stopCode() {
    this.javascriptInterpreterService.stopCode();
  }

  pinLabel(board: Board, pin ) {
    return board.pinLabel(pin);
  }

  scanLocalNetwork(localIP) {
    alert(localIP);
  }
}
