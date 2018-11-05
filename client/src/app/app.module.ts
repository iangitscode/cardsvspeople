import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketService } from './socket-service/socket-service';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
