import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as io from 'socket.io-client';

@Injectable()
export class LocalIpService {

  currentHostIndex= 0;
  hostsToScan = [];
  hostsStatus = {};

  checkingHostSubject = new Subject();
  checkingHost = this.checkingHostSubject.asObservable();

  constructor() { }


  localAddresses(sampleIp) {
      const ipArray = sampleIp.split('.');
      let addresses = [];
      const localRange = _.range(1, 255);

      addresses = _.map(localRange, d => `${ipArray[0]}.${ipArray[1]}.${ipArray[2]}.${d}`);
      return addresses;
  }

  checkPort(host, port) {
    const resolver = (resolve, reject) => {
      console.log('CHECK CONNECTION', `http://${host}:${port}`);
        const socket = io(`http://${host}:${port}`, {
          timeout: 5000,
          reconnection: false,
          reconnectionAttempts: 1
        });
        socket.on('error', function(e) {
          console.log('CONNECTION ERROR', `http://${host}:${port}`);
          resolve({e: e, status: 'error', host: host, port: port});
        });

        socket.on('connect_error', function(e) {
          console.log('CONNECTION ERROR', e ,  `http://${host}:${port}`);
          resolve({e: e, status: e, host: host, port: port});
        });
        /*
        socket.on('connect_timeout', function(e) {
          console.log('CONNECTION TIMEOUT', `http://${host}:${port}`);
          resolve({e: e, status: 'timeout', host: host, port: port});
        });
        */

        socket.on('connect', (e) => {
          socket.emit('disconnect');
          socket.disconnect();
          console.log('CONNECTION OK', `http://${host}:${port}`);
          resolve({e: null, status: 'open', host: host, port: port});
        });
    };


    return new Promise(resolver);
  }

  getNextHost() {
    if (this.currentHostIndex < this.hostsToScan.length) {
      const host = this.hostsToScan[this.currentHostIndex];
      this.currentHostIndex++;
      return host;
    } else {
      return null;
    }
  }

  /**
   * Recursive promise that check ports until there is no more port to check
   *
   * @param {any} port
   * @returns
   * @memberof LocalIpService
   */
  scanHost(port) {

    const resolver = (resolve, reject) => {
      const host = this.getNextHost();

      if (host) {
        this.checkPort(host, port)
        .then((res: any) => {
          this.checkingHostSubject.next(host);
          if (res.status === 'open') {
            this.hostsStatus[res.host] = true;
              console.log('Reader found: ', res.host, res.port, res.status);
          } else {
            this.hostsStatus[res.host] = false;
          }

          return this.scanHost(port);
        })
        .then(() => resolve());

      } else {
        resolve();
      }

    };


    return new Promise(resolver);
  }

  checkPorts(ip, port) {
    return new Promise((resolve, reject) => {
      this.hostsToScan = this.localAddresses(ip);

        const scahHostPromises = [
        ];
        _.each(_.range(0, 20), () => {
          scahHostPromises.push(this.scanHost(port));
        });

        Promise.all(scahHostPromises)
        .then(() => {
          console.log('finished');
          return this.finalReport(this.hostsStatus);
        })
        .then(devices => resolve(devices));
    });


  }

  finalReport(hostStatus) {
    return new Promise((resolve, reject) => {
      const foundDevices = [];
      console.log(hostStatus);
      _.each(hostStatus, (val, host) => {
        if (val === true) { foundDevices.push(host); }
      });
      resolve(foundDevices);
    });
  }

}
