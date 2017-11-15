import { Injectable, setTestabilityGetter } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs/Subject';
import { Board } from './models/board';

@Injectable()
export class BoardAgentService {
  boardSubject = new Subject();
  board = this.boardSubject.asObservable();

  constructor() {

  }

  connectToBoard(host) {
    const socket = io(`http://${host}:19675`);
      socket.emit('name', 'Firstmakers Blockly');

      socket.on('board', boardName => {

        console.log('BOARD', boardName);

        const nameSpace = boardName.charAt(0) === '/'
                    ? boardName
                    : `/${boardName}`;

        const boardSocket = io.connect(`http://${host}:19675${nameSpace}`);
        console.log(new Date(), 'CONNECTED TO SOCKET', boardName, boardSocket.id);
        const myBoard = new Board(boardName, boardSocket);
        myBoard.socket = boardSocket;
        this.boardSubject.next(myBoard);

      });
  }

}
