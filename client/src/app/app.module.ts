import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketService } from './socket-service/socket-service';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
