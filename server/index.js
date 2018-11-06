const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const cardsJSON = require('./cards.json')
const objs = require('./gameObj');


// console.log(cardsJSON.black[0]);
// console.log(cardsJSON.white[0]);

app.use(serve('../client/public_html'));
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const games = new Map();
const MAX_CARDS_IN_HAND = 7;

function generateRandomAlpha(n) {
	let output = "";
	for (let i = 0; i < n; i++) {
		output += letters[Math.floor(Math.random()*letters.length)];
	}
	return output;
}

/*
 * Creates a new Game, adds it to games, and returns roomName
 */ 
function createNewRoom() {
	let roomName = generateRandomAlpha(4);

	while (games.has(roomName)) {
		roomName = generateRandomAlpha(4);
	}

	let game = new objs.Game(roomName);
	games.set(roomName, game);
	return roomName;
}

/*
 * Creates a new player in specified room, and returns playerId
 */ 
function createPlayerInRoom(roomName, socketId) {
	const playerIdLen = 10;

	if (games.has(roomName) == false) {
		return;
	}

	let playerId = generateRandomAlpha(playerIdLen);

	while (games.get(roomName).players.has(playerId)) {
		playerId = generateRandomAlpha(playerIdLen);
	}	

	let player = new objs.Player(playerId, socketId);
	games.get(roomName).players.set(playerId, player);
	return playerId;
}

function generateCard(isWhiteCard, roomName) {
	if (isWhiteCard) {
		let numCards = cardsJSON.white.length;
		let cardNum = Math.floor(Math.random() * numCards);
		while (games.get(roomName).whiteCardsUsed.has(cardNum)) {
			cardNum = Math.floor(Math.random() * numCards);
		}
		games.get(roomName).whiteCardsUsed.add(cardNum);
		return cardsJSON.white[cardNum];
	} else {
		let numCards = cardsJSON.black.length;
		let cardNum = Math.floor(Math.random() * numCards);
		while (games.get(roomName).blackCardsUsed.has(cardNum)) {
			cardNum = Math.floor(Math.random() * numCards);
		}
		games.get(roomName).blackCardsUsed.add(cardNum);
		return cardsJSON.black[cardNum];
	}
}

io.on('connection', function(socket) {

	socket.on('createRoom', (respond) => {
		// Create a new Game object
		let roomName = createNewRoom();

		// Join the room
		socket.join(roomName);

		// Create a new player in the Game
		playerId = createPlayerInRoom(roomName, socket.id);

		// Since this player created the Game, they are the leader
		games.get(roomName).leaderId = playerId;

		// Send back a success status, let the client know their playerId roomName
		respond({status: "success", msg: {roomName: roomName, playerId: playerId}});

		// Say hi to everyone!
		io.sockets.in(roomName).emit("saysomething", "hello everyone");
	});
	
	socket.on('joinRoom', (roomName, respond) => {
		// Make sure the roomName exists
		if (games.has(roomName)) {

			// Join the room
			socket.join(roomName);

			// Register as a player in the room
			playerId = createPlayerInRoom(roomName, socket.id);

			console.log(games.get(roomName));

			// Send back a success status, let the client know their playerId roomName
			respond({status: "success", msg: {roomName: roomName, playerId: playerId}})

			// Say hi to everyone!
			io.sockets.in(roomName).emit("saysomething", "hello everyone");
			
		} else {
			respond({status: "error", msg: "Wrong room"});
		}
	});

	socket.on('startGame', (playerId, roomName) => {
		if (games.has(roomName)) {
			if (games.get(roomName).leaderId == playerId) {

				// Start the game for everyone
				io.sockets.in(roomName).emit("startGame");

				// Testing giving each player a hand of cards
				games.get(roomName).players.forEach((value, key) => {
					for (let i = 0; i < MAX_CARDS_IN_HAND; i++) {
						value.hand.push(generateCard(true, roomName));
					}
					io.to(value.socketId).emit('setHand', {status: "success", msg: value.hand});
				});
				console.log(games.get(roomName));
				// END TESTING

			} else {
				respond({status: "error", msg: "Not leader"});
			}
		} else {
			respond({status: "error", msg: "Wrong room"})
		}
	});
	socket.emit('hi',"Connected!");
});

server.listen(3000);
