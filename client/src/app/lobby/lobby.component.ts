import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket-service/socket-service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {
  private formInput: string;
  private nameInput: string;
  private roomCreator: boolean;
  private playerNames: Subject<string> = new Subject<string>();

  constructor(private socketService: SocketService,
              private globals: Globals) {}

  ngOnInit() {
    this.roomCreator = false;
    this.socketService.getSocket().on('updatePlayerNames', (names) => {
      this.playerNames.next(names);
    });
  }

  public createRoom(): void {
    this.socketService.getSocket().emit('createRoom', (response) => {
      if (response.status == "success") {
        this.globals.playerId = response.msg.playerId;
        this.globals.roomName = response.msg.roomName;
        this.roomCreator = true;
      }
    });
  }

  public joinRoom(): boolean {
    this.socketService.getSocket().emit('joinRoom', this.formInput, (response) => {
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

 public setName(): void {
   if (this.nameInput.length <= 16) {
     this.globals.playerName = this.nameInput;
     this.socketService.getSocket().emit('setName', this.globals.playerId, this.globals.roomName, this.globals.playerName);
   }
 }

 public getPlayerNames(): Observable<string> {
   return this.playerNames;
 }
}