import { Component } from '@angular/core';
import { SocketService } from '../socket-service/socket-service';
import { Card } from './card';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent {
  private hand: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);
  private numSpaces: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);
  private currentBlackCard: ReplaySubject<Card> = new ReplaySubject<Card>(1);
  private currentBlackCardText: Observable<string> = this.currentBlackCard.pipe(map((card: Card) => {
    return card.text.replace(/_/g,"___");
  }));

  private selectedCards = []

  constructor(private socketService: SocketService){}

  ngOnInit() {
    this.socketService.getSocket().on('setHand', (data) => {
      if (data.status == 'success') {
        this.hand.next(data.msg.map((cardJSON) => {
          return new Card(cardJSON);
        }));
      }
    });

    this.socketService.getSocket().on('setBlackCard', (data) => {
      if (data.status == 'success') {
        this.currentBlackCard.next(new Card(data.msg));
        this.numSpaces.next(data.msg.pick);
      }
    });
  }

  public getHand(): Observable<Card[]> {
    return this.hand;
  }

  public getCurrentBlackCardText(): Observable<string> {
    return this.currentBlackCardText;
  }

  public clickCard(index: Number): void {
    if (this.selectedCards.includes(index)) {
       // Remove the card from selectedCards
       this.selectedCards.splice(this.selectedCards.indexOf(index), 1);
    } else if (this.selectedCards.length == this.numSpaces.value) {
      this.selectedCards = [index];
    } else {
      this.selectedCards.push(index);
    }
    console.log(this.selectedCards);
  }

  public cardIsSelected(index: Number): boolean {
    return this.selectedCards.includes(index);
  }
}