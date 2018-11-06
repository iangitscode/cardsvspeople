import { Component } from '@angular/core';
import { SocketService } from '../socket-service/socket-service';
import { Card } from './card';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent {
  private hand: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  constructor(private socketService: SocketService){}

  ngOnInit() {
    this.socketService.getSocket().on('setHand', (data) => {
      if (data.status == 'success') {
        this.hand.next(data.msg.map((cardJSON) => {
          console.log(cardJSON);
          return new Card(cardJSON);
        }));
      }
    });
  }

  public getHand(): Observable<Card[]> {
    return this.hand;
  }
}