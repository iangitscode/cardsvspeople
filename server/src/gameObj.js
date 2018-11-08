class Game {
  constructor(roomName) {
    this.roomName = roomName;
    this.players = [];
    this.playerIdMap = new Map();
    this.whiteCardsUsed = new Set();
    this.blackCardsUsed = new Set();
    this.currentPlayerTurn = 0;
    this.currentState;
    this.currentExpectedCards;
    this.leaderId = "";
  }

  playerIndexFromPlayerId(playerId) {
    if (this.playerIdMap.has(playerId)) {
      return this.playerIdMap.get(playerId);
    }
    return -1;
  }

  getPlayer(playerId) {
    if (this.playerIdMap.has(playerId)) {
      return this.players[this.playerIdMap.get(playerId)];
    }
  }

  hasPlayerWithId(playerId) {
    for (let player of this.players) {
      if (player.id == playerId) {
        return true;
      }
    }
    return false;
  }

  numPlayersWithSelection() {
    let count = 0;
    for (let player of this.players) {
      if (player.selection.length > 0) {
        count++;
      }
    }
    return count;
  }

  getAllPlayerSelection() {
    let output = [];
    for (let player of this.players) {
      output = output.concat(player.selection);
    }
    return output;
  }
}

class Player {
  constructor(id, socketId) {
    this.id = id;
    this.socketId = socketId;
    this.hand = [];
    this.points = 0;
    this.selection = [];
  }
}

module.exports = {Game, Player};

