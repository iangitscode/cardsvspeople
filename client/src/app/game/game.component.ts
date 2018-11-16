import { Component } from '@angular/core';
import { SocketService } from '../socket-service/socket-service';
import { Card } from './card';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Globals } from "../globals";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent {
  private hand: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);
  private numSpaces: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private isMyTurn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentBlackCard: ReplaySubject<Card> = new ReplaySubject<Card>(1);
  private currentBlackCardText: Observable<string> = this.currentBlackCard.pipe(map((card: Card) => {
    return card.text.replace(/_/g,"___");
  }));
  private whiteCardSubmissions: BehaviorSubject<Card[][]> = new BehaviorSubject<Card[][]>([]);

  private selectedCards = []

  constructor(private socketService: SocketService,
              private globals: Globals){}

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
        this.currentBlackCard.next(new Card(data.msg.card));
        this.numSpaces.next(data.msg.card.pick);

        // When we receive a black card, a new turn has been started, so remove previous submissions
        this.whiteCardSubmissions.next([]);
      }
    });

    this.socketService.getSocket().on('sendWhiteCardSelections', (data) => {
      if (data.status == 'success') {
        this.whiteCardSubmissions.next(data.msg.map((cardsByPlayer) => {
          return cardsByPlayer.cards.map((cardJSON) => {
            return new Card(cardJSON);
          });
        }));
      }
    });

    this.socketService.getSocket().on('setIsMyTurn', (data) => {
      if (data.status == 'success') {
        this.isMyTurn.next(data.msg);
      }
    });
  }

  public getHand(): Observable<Card[]> {
    return this.hand;
  }

  public getCurrentBlackCardText(): Observable<string> {
    return this.currentBlackCardText;
  }

  public clickCard(index: number): void {
    if (this.selectedCards.includes(index) && this.isMyTurn.value == false) {
       // Remove the card from selectedCards
       this.selectedCards.splice(this.selectedCards.indexOf(index), 1);
    } else if (this.selectedCards.length == this.numSpaces.value) {
      this.selectedCards = [index];
    } else {
      this.selectedCards.push(index);
    }
  }

  public cardIsSelected(index: number): boolean {
    return this.selectedCards.includes(index);
  }

  public sendSelectedWhiteCard(): void {
    this.socketService.getSocket().emit('sendWhiteCard', this.selectedCards, this.globals.playerId, this.globals.roomName);
    this.selectedCards = [];
  }

  public isMyTurnObservable(): Observable<boolean> {
    return this.isMyTurn;
  }

  public getWhiteCardSubmissions(): Observable<Card[][]> {
    return this.whiteCardSubmissions;
  }

  public selectSubmission(index: number): void {
    this.socketService.getSocket().emit('selectWinner', index, this.globals.playerId, this.globals.roomName);
  }
}