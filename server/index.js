const Koa = require('koa');
const serve = require('koa-static');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const cards_json = require('./cards.json')
const Game = require('./gameObj');


// console.log(cards_json.black[0]);
// console.log(cards_json.white[0]);

app.use(serve('../client/public_html'));
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const rooms = new Set();

console.log((new Game()).players)

function generateRoomName() {
	let output = "";
	for (let i = 0; i < 4; i++) {
		output += letters[Math.floor(Math.random()*letters.length)];
	}
	return output;
}

function createNewRoom() {
	let roomName = generateRoomName();
	while (rooms.has(roomName)) {
		roomName = generateRoomName();
	}
	rooms.add(roomName);
	return roomName;
}

io.on('connection', function(socket) {
	socket.on('createRoom', (respond) => {
		let roomName = createNewRoom();
		socket.join(roomName);
		console.log(rooms);
		respond({status: "success", msg: roomName});
		io.sockets.in(roomName).emit("saysomething", "hello everyone");
	});
	
	socket.on('joinRoom', (roomName, respond) => {
		if (rooms.has(roomName)) {
			socket.join(roomName);
			io.sockets.in(roomName).emit("saysomething", "hello everyone");
			respond({status: "success"})
		} else {
			respond({status: "error", msg: "Wrong room"});
		}
	});
	socket.emit('hi',"Connected!");
});



server.listen(3000);
