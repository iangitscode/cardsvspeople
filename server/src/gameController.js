const cardsJSON = require('./cards.json')
const roomManager = require('./rooms.js');
const MAX_CARDS_IN_HAND = 7;
const nodeConstants = require('../nodeConstants.js');

state = {
  SUBMIT: 0,
  PICK: 1,
}

function convertCardId(ids) {
  return ids.map((index) => {
    return cardsJSON.white[index];
  });
}

function generateCard(isWhiteCard, roomName) {
  if (isWhiteCard) {
    let numCards = cardsJSON.white.length;
    let cardNum = Math.floor(Math.random() * numCards);
    while ( roomManager.getGame(roomName).whiteCardsUsed.has(cardNum) ||
            cardsJSON.white[cardNum].text.includes('\n') ||
            cardsJSON.white[cardNum].text.includes('*')) {
      cardNum = Math.floor(Math.random() * numCards);
    }
    roomManager.getGame(roomName).whiteCardsUsed.add(cardNum);
    return cardNum;
  } else {
    let numCards = cardsJSON.black.length;
    let cardNum = Math.floor(Math.random() * numCards);
    while ( roomManager.getGame(roomName).blackCardsUsed.has(cardNum) ||
            cardsJSON.black[cardNum].text.includes('\n') ||
            cardsJSON.black[cardNum].text.includes('*')
            || cardsJSON.black[cardNum].pick != 3) {
      cardNum = Math.floor(Math.random() * numCards);
    }
    roomManager.getGame(roomName).blackCardsUsed.add(cardNum);
    return cardNum;
  }
}

function emitCurrentPlayerTurn(roomName) {
  if (roomManager.isValidRoomName(roomName)) {
    const currentPlayerTurn = roomManager.getGame(roomName).currentPlayerTurn;
    for (let index in roomManager.getGame(roomName).players) {
      let val = false;
      if (index == currentPlayerTurn) {
        val = true;
      } 
      nodeConstants.io.to(roomManager.getGame(roomName).players[index].socketId).emit('setIsMyTurn', {status: "success", msg: val});
    }
  }
}

function startTurn(playerId, roomName) {
    if (roomManager.isValidRoomName(roomName)) {
      roomManager.getGame(roomName).players.forEach((value, key) => {
        for (let i = 0; i < MAX_CARDS_IN_HAND; i++) {
          value.hand.push(generateCard(true, roomName));
        }
        nodeConstants.io.to(value.socketId).emit('setHand', {status: "success", msg: convertCardId(value.hand)});
      });

      const blackCard = generateCard(false, roomName);
      nodeConstants.io.sockets.in(roomName).emit('setBlackCard', {status: "success", msg: {card: cardsJSON.black[blackCard]}});
      emitCurrentPlayerTurn(roomName);
      roomManager.getGame(roomName).currentState = state.SUBMIT;
      roomManager.getGame(roomName).currentExpectedCards = cardsJSON.black[blackCard].pick;
  }
}

function receiveWhiteCard(selection, playerId, roomName) {
  if (roomManager.isValidPlayerInRoom(playerId, roomName) && 
      roomManager.getGame(roomName).playerIndexFromPlayerId(playerId) != roomManager.getGame(roomName).currentPlayerTurn &&
      roomManager.getGame(roomName).getPlayer(playerId).selection.length == 0 &&
      selection.length == roomManager.getGame(roomName).currentExpectedCards) {
    roomManager.getGame(roomName).getPlayer(playerId).selection = selection.map((index) => {
      return roomManager.getGame(roomName).getPlayer(playerId).hand[index];
    });
    if (roomManager.getGame(roomName).numPlayersWithSelection() == roomManager.getGame(roomName).players.length - 1) {
      startWinnerSelection(roomName);
    }
  }
}

function startWinnerSelection(roomName) {
  roomManager.getGame(roomName).currentState = state.PICK;
  let toSend = roomManager.getGame(roomName).getAllPlayerSelection().map((playerSubmission) => {
    return {cardIds: playerSubmission, cards: convertCardId(playerSubmission)};
  });
  nodeConstants.io.sockets.in(roomName).emit('sendWhiteCardSelections', {status: "success", msg: toSend});
}

module.exports = {startTurn, receiveWhiteCard};