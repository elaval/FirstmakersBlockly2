import { BlocklyService } from './blockly.service';
import { Board } from '../board-agent/models/board';
import { Injectable } from '@angular/core';
import Interpreter from 'js-interpreter';
import Blockly from 'node-blockly/browser';


@Injectable()
export class JavascriptInterpreterService {
  highlightPause: boolean;
  board: Board;
  stop = false;

  boardFunctions = {
    digitalWrite: (pin, value) => {
      console.log(pin, value);
    },

    setPinValue: (pinNumber, value) => {
      if (this.board) {
        this.board.setPinValue(pinNumber, value);
      }
    },

    potentiometer: () => {
      const resolver = (resolve, reject) => {
        if (this.board) {
          resolve(this.board.pins[19].value);
        } else {
          resolve(null);
        }
      };

      return new Promise(resolver);
    },

    temperatureSensor: () => 123,

    lightSensor: () => 123,

    audioSensor: () => 123,

    humiditySensor: () => 123,

    infraredSensor: () => 123,

    button: () => {
      return Promise.resolve(123);
    },

    light: (state) => {
      if (this.board) {
        this.board.setPinValue(13, state);
      }
    },

    analogWrite: (pin, value) => {
      // tbc
    },

    digitalRead: (pin) => {
      return this.board.digitalRead(pin);
    },

    analogRead: (pin) => {
      return this.board.analogRead(pin);
    },

    buzzer: (state) => {
      this.board.setPinValue(6, state);
    },

    servo: (pin, angle) => {
      // tbc
    },

    motorConfig: (id, powerPin, dirPin) => {
      // tbc
    },

    motorSpeed: (id, speed) => {
      // tbc
    },

    motorDirection: (id, dir) => {
      // tbc
    }

  };
  constructor(
    private blocklyService: BlocklyService
  ) { }

  stopCode() {
    this.stop = true;
  }

  runCode(code) {
    // Configutarion of block higlighting functionality
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');

    const myInterpreter = new Interpreter(code, this.initerpreterAPIFunc.bind(this));
    const nextStep = () => {
      let ok;
      try {
        if (!this.stop) {
          ok = myInterpreter.step();
        } else {
          ok = false;
          this.stop = false;
        }
      } finally {
        if (!ok) {
          // Program complete or stopped, no more code to execute.
          this.highlightBlock(null);
          return;
        }
      }
      window.setTimeout(nextStep, 10);

    };
    nextStep();
  }

  setBoard(board) {
    this.board = board;
  }

  initerpreterAPIFunc = (interpreter, scope) => {
    let wrapper;

    // getXhr() block.
    wrapper = function getXhr(href, callback) {
      href = href ? href.toString() : '';

      const req = new XMLHttpRequest();
      req.open('GET', href, true);
      req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
          callback(interpreter.createPrimitive('req.responseText'));
        }
      };
      req.send(null);
    };
    interpreter.setProperty(scope, 'getXhr',
        interpreter.createAsyncFunction(wrapper));


    // alert() block.
    wrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(alert(text));
    };
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(wrapper));

    // prompt() block.
    wrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
        interpreter.createNativeFunction(wrapper));

    // potentiometer() block.
    wrapper = (callback) => {
      this.boardFunctions.analogRead(5)
      .then(function(value) {
        callback(interpreter.createPrimitive(value));
      });
    };

    interpreter.setProperty(scope, 'fm_potentiometer',
        interpreter.createAsyncFunction(wrapper));

    // temperatureSensor()
    wrapper = () => {
      const value = this.boardFunctions.temperatureSensor();
      return interpreter.createPrimitive(value);
    };

    interpreter.setProperty(scope, 'fm_temperatureSensor',
        interpreter.createNativeFunction(wrapper));

    // lightSensor()
    wrapper = () => {
      const value = this.boardFunctions.lightSensor();
      return interpreter.createPrimitive(value);
    };

    interpreter.setProperty(scope, 'fm_lightSensor',
        interpreter.createNativeFunction(wrapper));

    // audioSensor()
    wrapper = () => {
      const value = this.boardFunctions.audioSensor();
      return interpreter.createPrimitive(value);
    };

    interpreter.setProperty(scope, 'fm_audioSensor',
        interpreter.createNativeFunction(wrapper));

   // humiditySensor()
    wrapper = () => {
      const value = this.boardFunctions.humiditySensor();
      return interpreter.createPrimitive(value);
    };

    interpreter.setProperty(scope, 'fm_humiditySensor',
        interpreter.createNativeFunction(wrapper));

    // infraredSensor()
    wrapper = () => {
      const value = this.boardFunctions.infraredSensor();
      return interpreter.createPrimitive(value);
    };

    interpreter.setProperty(scope, 'fm_infraredSensor',
        interpreter.createNativeFunction(wrapper));

    // fm_button()
    wrapper = (callback) => {
      this.boardFunctions.digitalRead(2)
      .then(function(value) {
        callback(interpreter.createPrimitive(value));
      });
    };

    interpreter.setProperty(scope, 'fm_button',
        interpreter.createAsyncFunction(wrapper));

    // light(state)
    wrapper = (state) => {
      state = state ? state.toBoolean() : true;
      return interpreter.createPrimitive(this.boardFunctions.light(state));
    };
    interpreter.setProperty(scope, 'fm_light',
        interpreter.createNativeFunction(wrapper));

    // digitalWrite(pin,state)
    wrapper = (pin, value) => {
      pin = pin ? pin.toNumber() : 13;
      value = value ? value.toBoolean() : false;
      return interpreter.createPrimitive(this.boardFunctions.setPinValue(pin, value));
    };
    interpreter.setProperty(scope, 'fm_digitalWrite', interpreter.createNativeFunction(wrapper));

    // analogWrite(pin,value)
    wrapper = (pin, value) => {
      pin = pin ? pin.toNumber() : 13;
      value = value ? value.toNumber() : 0;

      return interpreter.createPrimitive(this.boardFunctions.analogWrite(pin, value));
    };
    interpreter.setProperty(scope, 'fm_analogWrite',
        interpreter.createNativeFunction(wrapper));

    // digitalRead(pin).
    wrapper = (pin, callback) => {
      pin = pin ? pin.toNumber() : 2;
      this.boardFunctions.digitalRead(pin)
      .then(function(value) {
        callback(interpreter.createPrimitive(value));
      });
    };

    interpreter.setProperty(scope, 'fm_digitalRead',
        interpreter.createAsyncFunction(wrapper));

    // analogRead(pin).
    wrapper = (pin, callback) => {
      pin = pin ? pin.toNumber() : 0;
      this.boardFunctions.analogRead(pin)
      .then(function(value) {
        callback(interpreter.createPrimitive(value));
      });
    };

    interpreter.setProperty(scope, 'fm_analogRead',
        interpreter.createAsyncFunction(wrapper));

    // buzzer(state)
    wrapper = (state) => {
      state = state ? state.toBoolean() : true;
      return interpreter.createPrimitive(this.boardFunctions.buzzer(state));
    };
    interpreter.setProperty(scope, 'fm_buzzer',
        interpreter.createNativeFunction(wrapper));

    // servo(pin,angle)
    wrapper = (pin, angle) => {
      pin = pin ? pin.toNumber() : 12;
      angle = angle ? angle.toNumber() : 0;
      return interpreter.createPrimitive(this.boardFunctions.servo(pin, angle));
    };
    interpreter.setProperty(scope, 'fm_servo',
        interpreter.createNativeFunction(wrapper));

    // motorConfig(id,powerPin,dirPin)
    wrapper = (id, powerPin, dirPin) => {
      id = id ? id.toString() : 'A';
      powerPin = powerPin ? powerPin.toNumber() : 3;
      dirPin = dirPin ? dirPin.toNumber() : 8;
      return interpreter.createPrimitive(this.boardFunctions.motorConfig(id, powerPin, dirPin));
    };
    interpreter.setProperty(scope, 'fm_motor_config',
        interpreter.createNativeFunction(wrapper));


    // motorSpeed(id,speed)
    wrapper = (id, speed) => {
      id = id ? id.toString() : 'A';
      speed = speed ? speed.toNumber() : 0;
      return interpreter.createPrimitive(this.boardFunctions.motorSpeed(id, speed));
    };
    interpreter.setProperty(scope, 'fm_motor_speed',
        interpreter.createNativeFunction(wrapper));

    // motorDirection(id,direction)
    wrapper = (id, dir) => {
      id = id ? id.toString() : 'A';
      dir = dir ? dir.toNumber() : 0;
      return interpreter.createPrimitive(this.boardFunctions.motorDirection(id, dir));
    };
    interpreter.setProperty(scope, 'fm_motor_direction',
        interpreter.createNativeFunction(wrapper));

    // say(text)
    wrapper = (text) => {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(window.alert(text));
    };
    interpreter.setProperty(scope, 'fm_say',
        interpreter.createNativeFunction(wrapper));

    // wait(time)
    wrapper = interpreter.createAsyncFunction(
      (timeInSeconds, callback) => {
        // Delay the call to the callback.
        setTimeout(callback, timeInSeconds);
      });

    interpreter.setProperty(scope, 'fm_wait', wrapper);

    // highlightBlock(id)
    wrapper = (id) => {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(this.highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));




  }

  /**
   * Implementations of "external" functions that are not device related
   * Other - device related - functions are implemented in DeviceDommandService (deviceCommand.service.js)
   */
  highlightBlock(id) {
    this.blocklyService.higlightBlock(id);
    // workspace.highlightBlock(id);
    this.highlightPause = true;
  }


}
