module.exports = class Game {
  constructor() {
    this.roomName = "";
    this.players = [];
    this.whiteCardsUsed = [];
    this.blackCardsUsed = [];
    this.currentPlayerTurn = 0;
  }

  get fullName() {
      return this.firstName + " " + this.lastName;
  }
};

