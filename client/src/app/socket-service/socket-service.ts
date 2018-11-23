import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket:SocketIOClient.Socket;
  constructor() {
    // TODO: Fix this
     // this.socket = io.connect("localhost:9001");
     this.socket = io.connect(window.location.host);
  }
  public getSocket():SocketIOClient.Socket {
    return this.socket;
  }
}
