import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const PIN_MODES = {
    0 : 'INPUT',
    1 : 'OUTPUT',
    2 : 'ANALOG',
    3 : 'PWM',
    4 : 'SERVO',
    5 : 'SHIFT',
    6 : 'I2C',
    7 : 'ONEWIRE',
    8 : 'STEPPER',
    10 : 'SERIAL',
    11 : 'PULLUP',
    127 : 'IGNORE',
    16 : 'UNKOWN'
};

export class Board {
  currentState: any;
  analogPins: any;
  pins: any;
  name: any;
  updateSubject = new BehaviorSubject(null);
  update = this.updateSubject.asObservable();

  socket;

  constructor(boardName, socket) {
    this.name = boardName;
    this.socket = socket;

    socket.on('ready', (pins) => {
      this.updateSubject.next(null);
      console.log(`BOARD READY: ${boardName}`);
    });

    socket.on('pins', pins => {
      this.pins = pins;
      this.updateSubject.next(null);
      console.log(pins);
    });

    socket.on('analogPins', d => {
      this.analogPins = d;
    });

    socket.on('analogRead', data => {
      const pinNumber = data.pin;
      const value = data.value;

      this.pins[pinNumber].value = value;
    });

    socket.on('digitalRead', data => {
      const pinNumber = data.pin;
      const value = data.value;

      this.pins[pinNumber].value = value;
    });

    socket.on('data', data => {
      if (data && this.pins) {
        const pinNumber = data.pin;
        const value = data.value;

        this.pins[pinNumber] = this.pins[pinNumber] || {};
        this.pins[pinNumber].value = value;
      } else {
        socket.emit('pins', (pins) => {
          this.pins = pins;
        });
      }

    });

    socket.on('disconnect', (d) => {
      this.pins = null;
      this.updateSubject.next(null);

    });

    socket.on('state', state => {
      this.currentState = state;
      if (state === 'disconnected') {
        this.pins = null;
        this.updateSubject.next(null);

      }
    });
  }

  dataType(pin) {
    let type = 'number';
    if (pin && (pin.mode === 0 || pin.mode === 1)) {
        type = 'binary';
    }

    return type;
  }

  pinLabel(pinNumber) {
    let pinLabel = `${pinNumber}`;

    // Chekc if this is an analog pin
    if (this.analogPins && this.analogPins.indexOf(pinNumber) >= 0 ) {
        pinLabel = `A${this.analogPins.indexOf(pinNumber)}`;
    }

    return pinLabel;
  }

  getPinModeDesc(mode) {
    return PIN_MODES[mode];
  }

  setPinValue(pinNumber, value) {

    if (this.socket) {
      this.socket.emit('pinValue', {pin: pinNumber, value: value});
    }
  }

  // Sends a message to the agen to change a pin´s mode
  setPinMode(pinNumber, mode) {

    if (this.socket) {
      this.socket.emit('pinMode', {pin: pinNumber, mode: mode});
    }
  }

  analogRead(analogPinNumber) {
    const resolver = (resolve, reject) => {
      if (this.socket) {
        const pinNumber = this.analogPins[analogPinNumber];
        this.socket.emit('analogRead', pinNumber, (pin) => {
          resolve(pin.value);
        });
      } else {
        reject('No Socket');
      }
    };
    return new Promise(resolver);
  }

  digitalRead(pinNumber) {
    const resolver = (resolve, reject) => {
      if (this.socket) {
        this.socket.emit('digitalRead', pinNumber, (pin) => {
          resolve(pin.value);
        });
      } else {
        reject('No Socket');
      }
    };
    return new Promise(resolver);
  }

  get isConnected(): boolean {
    return this.currentState === 'connected';
  }


}
