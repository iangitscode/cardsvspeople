class Game {
  constructor(roomName) {
    this.roomName = roomName;
    this.players = new Map();
    this.whiteCardsUsed = new Set();
    this.blackCardsUsed = new Set();
    this.currentPlayerTurn = 0;
    this.leaderId = "";
  }

  get fullName() {
      return this.firstName + " " + this.lastName;
  }
}

class Player {
  constructor(id, socketId) {
    this.id = id;
    this.socketId = socketId;
    this.hand = [];
    this.points = 0;
  }
}

module.exports = {Game, Player};

