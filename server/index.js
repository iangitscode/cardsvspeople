const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const serve = require('koa-static');
const io = require('socket.io')(server);

app.use(serve('../client/public_html'));

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const rooms = new Set();

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

io.on('connection', function(socket){
	socket.on('createRoom', () => {
		let roomName = createNewRoom();
		socket.join(roomName);
		socket.emit('receiveRoomName', roomName);
		io.sockets.in(roomName).emit("saysomething", "hello everyone");
	});
	
	socket.on('joinRoom', (roomName) => {
		if (rooms.has(roomName)) {
			socket.join(roomName);
			io.sockets.in(roomName).emit("saysomething", "hello everyone");
		} else {
			socket.emit('wrongRoom', '');
		}
	});
});

server.listen(3000);