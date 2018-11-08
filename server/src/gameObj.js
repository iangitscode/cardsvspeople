class Game {
  playerIndexFromPlayerId(playerId) {
    if (this.playerIdMap.has(playerId)) {
      return this.playerIdMap.get(playerId);
    }
    return -1;
  }

  hasPlayerWithId(playerId) {
    for (let player of this.players) {
      if (player.id == playerId) {
        return true;
      }
    }
    return false;
  }

  get hello() {
    return "hi";
  }

  constructor(roomName) {
    this.roomName = roomName;
    this.players = [];
    this.playerIdMap = new Map();
    this.whiteCardsUsed = new Set();
    this.blackCardsUsed = new Set();
    this.currentPlayerTurn = 0;
    this.leaderId = "";
  }
}

class Player {
  constructor(id, socketId) {
    this.id = id;
    this.socketId = socketId;
    this.hand = [];
    this.points = 0;
    this.selection;
  }
}

module.exports = {Game, Player};

