import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket-service/socket-service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.less']
})
export class LobbyComponent implements OnInit {
  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.getSocket().on('hi', (msg) => {
      console.log(msg);
    });
  }

}