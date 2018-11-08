const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

const cardsJSON = require('./cards.json')
const roomManager = require('./src/rooms.js');

app.use(serve('../client/public_html'));

const MAX_CARDS_IN_HAND = 7;

function generateCard(isWhiteCard, roomName) {
	if (isWhiteCard) {
		let numCards = cardsJSON.white.length;
		let cardNum = Math.floor(Math.random() * numCards);
		while (	roomManager.getGame(roomName).whiteCardsUsed.has(cardNum) ||
					 	cardsJSON.white[cardNum].text.includes('\n') ||
					 	cardsJSON.white[cardNum].text.includes('*')) {
			cardNum = Math.floor(Math.random() * numCards);
		}
		roomManager.getGame(roomName).whiteCardsUsed.add(cardNum);
		return cardsJSON.white[cardNum];
	} else {
		let numCards = cardsJSON.black.length;
		let cardNum = Math.floor(Math.random() * numCards);
		while (	roomManager.getGame(roomName).blackCardsUsed.has(cardNum) ||
						cardsJSON.black[cardNum].text.includes('\n') ||
					 	cardsJSON.black[cardNum].text.includes('*')) {
			cardNum = Math.floor(Math.random() * numCards);
		}
		roomManager.getGame(roomName).blackCardsUsed.add(cardNum);
		return cardsJSON.black[cardNum];
	}
}

function startTurn(roomName, playerId) {
	// Testing giving each player a hand of cards
	roomManager.getGame(roomName).players.forEach((value, key) => {
		for (let i = 0; i < MAX_CARDS_IN_HAND; i++) {
			value.hand.push(generateCard(true, roomName));
		}
		io.to(value.socketId).emit('setHand', {status: "success", msg: value.hand});
	});

	// Set the current black card
	io.sockets.in(roomName).emit('setBlackCard', {status: "success", msg: generateCard(false, roomName)});
	console.log(roomManager.getGame(roomName));
	// END TESTING
}

io.on('connection', function(socket) {

	socket.on('createRoom', (respond) => {
		// Create a new Game object
		let roomName = roomManager.createNewRoom();

		// Join the room
		socket.join(roomName);

		// Create a new player in the Game
		playerId = roomManager.createPlayerInRoom(roomName, socket.id);

		// Since this player created the Game, they are the leader
		roomManager.getGame(roomName).leaderId = playerId;

		// Send back a success status, let the client know their playerId roomName
		respond({status: "success", msg: {roomName: roomName, playerId: playerId}});

		// Say hi to everyone!
		io.sockets.in(roomName).emit("saysomething", "hello everyone");
	});
	
	socket.on('joinRoom', (roomName, respond) => {
		// Make sure the roomName exists
		if (roomManager.games.has(roomName)) {

			// Join the room
			socket.join(roomName);

			// Register as a player in the room
			playerId = roomManager.createPlayerInRoom(roomName, socket.id);

			console.log(roomManager.getGame(roomName));

			// Send back a success status, let the client know their playerId roomName
			respond({status: "success", msg: {roomName: roomName, playerId: playerId}})

			// Say hi to everyone!
			io.sockets.in(roomName).emit("saysomething", "hello everyone");
			
		} else {
			respond({status: "error", msg: "Wrong room"});
		}
	});

	socket.on('startGame', (playerId, roomName) => {
		if (roomManager.isValidPlayerInRoom(roomName, playerId)) {
			if (roomManager.getGame(roomName).leaderId == playerId) {

				// Start the game for everyone
				io.sockets.in(roomName).emit("startGame");
				startTurn(roomName, roomManager.getCurrentTurnPlayer(roomName))

			}
		}
	});
	socket.emit('hi',"Connected!");
});

server.listen(3000);
