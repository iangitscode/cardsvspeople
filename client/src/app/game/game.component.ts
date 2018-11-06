import { Component } from '@angular/core';
import { SocketService } from '../socket-service/socket-service';
import { Card } from './card';
import { Observable } from 'rxjs';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent {
  private hand: Observable<Card[]>;

  constructor(private socketService: SocketService){}

  ngOnInit() {
    this.socketService.getSocket().on('setHand', (data) => {
      if (data.status == 'success') {

      }
    });
  }
}