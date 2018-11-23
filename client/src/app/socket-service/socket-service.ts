import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket:SocketIOClient.Socket;
  constructor() { 
    // TODO: Change this to hosting ip address
     this.socket = io('http://localhost:9001');
    //this.socket = io('192.168.1.109:3000');
  }
  public getSocket():SocketIOClient.Socket {
    return this.socket;
  }
}
