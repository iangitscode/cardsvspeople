import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket-service/socket-service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {
  private formInput: string;
  private roomName: string;

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.getSocket().on('hi', (msg) => {
      console.log(msg);
    });
  }

  public createRoom(): void {
    this.socketService.getSocket().emit('createRoom', (response) => {
      if (response.status == "success") {
        this.roomName = response.msg;
      }
    });
  }

  public joinRoom(): boolean {
    this.socketService.getSocket().emit('joinRoom', this.formInput, (response) => {
      console.log(response);
      if (response.status == "success") {
        this.roomName = this.formInput;
      }
    });
    return false;
  }

 public isInRoom(): boolean {
   return this.roomName != undefined && this.roomName.length > 0;
 }
}