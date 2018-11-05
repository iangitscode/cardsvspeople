import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket:SocketIOClient.Socket;
  
  constructor() { 
    this.socket = io('http://localhost:3000');
  }

  public getSocket():SocketIOClient.Socket {
    return this.socket;
  } 

}
