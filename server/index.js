const nodeConstants = require('./nodeConstants.js');
const roomManager = require('./src/rooms.js');
const gameController = require('./src/gameController.js');

nodeConstants.app.use(nodeConstants.serve('../client/public_html'));

nodeConstants.io.on('connection', function(socket) {

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
		nodeConstants.io.sockets.in(roomName).emit("updatePlayerNames", roomManager.getGame(roomName).getAllPlayerNames());
	});
	
	socket.on('joinRoom', (roomName, respond) => {
		// Make sure the roomName exists
		roomName = roomName.toLowerCase();
		
		if (roomManager.games.has(roomName)) {

			// Join the room
			socket.join(roomName);

			// Register as a player in the room
			playerId = roomManager.createPlayerInRoom(roomName, socket.id);

			// Send back a success status, let the client know their playerId roomName
			respond({status: "success", msg: {roomName: roomName, playerId: playerId}})

			// Say hi to everyone!
			nodeConstants.io.sockets.in(roomName).emit("updatePlayerNames", roomManager.getGame(roomName).getAllPlayerNames());

		} else {
			respond({status: "error", msg: "Wrong room"});
		}
	});

	socket.on('startGame', (playerId, roomName) => {
		if (roomManager.isValidPlayerInRoom(playerId, roomName)) {
			if (roomManager.getGame(roomName).leaderId == playerId) {

				// Start the game for everyone
				nodeConstants.io.sockets.in(roomName).emit("startGame");
				gameController.startTurn(roomManager.getCurrentTurnPlayer(roomName), roomName)

			}
		}
	});

	socket.on('sendWhiteCard', (selection, playerId, roomName, respond) => {
		gameController.receiveWhiteCardSelection(selection, playerId, roomName, respond);
	});

	socket.on('selectWinner', (winningId, playerId, roomName) => {
		gameController.selectWinner(winningId, playerId, roomName);
	});

	socket.on('setName', (playerId, roomName, playerName) => {
		roomManager.setPlayerName(playerId, roomName, playerName);
		nodeConstants.io.sockets.in(roomName).emit("updatePlayerNames", roomManager.getGame(roomName).getAllPlayerNames());
	});
});

nodeConstants.server.listen(3000);
