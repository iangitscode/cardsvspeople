import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket-service/socket-service';
import { Globals } from '../globals';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {
  private formInput: string;
  private roomCreator: boolean;

  constructor(private socketService: SocketService,
              private globals: Globals) {}

  ngOnInit() {
    this.roomCreator = false;

    this.socketService.getSocket().on('hi', (msg) => {
      console.log(msg);
    });
  }

  public createRoom(): void {
    this.socketService.getSocket().emit('createRoom', (response) => {
      console.log(response);
      if (response.status == "success") {
        this.globals.playerId = response.msg.playerId;
        this.globals.roomName = response.msg.roomName;
        this.roomCreator = true;
      }
    });
  }

  public joinRoom(): boolean {
    this.socketService.getSocket().emit('joinRoom', this.formInput, (response) => {
      console.log(response);
      if (response.status == "success") {
        this.globals.playerId = response.msg.playerId;
        this.globals.roomName = response.msg.roomName;
      }
    });
    // Stop page reload on pressing Enter for form
    return false;
  }

 public isInRoom(): boolean {
   return this.globals.roomName != undefined && this.globals.roomName.length > 0;
 }

 public createdRoom(): boolean {
   return this.roomCreator;
 }

 public startGame(): void {
   this.socketService.getSocket().emit('startGame', this.globals.playerId, this.globals.roomName);
 }

 public getRoomName(): string {
   return this.globals.roomName;
 }
}