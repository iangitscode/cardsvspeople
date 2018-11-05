const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();
const server = require('http').createServer(app.callback());
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
	socket.on('createRoom', (respond) => {
		let roomName = createNewRoom();
		socket.join(roomName);
		respond({status: "success", msg: roomName});
		io.sockets.in(roomName).emit("saysomething", "hello everyone");
	});
	
	socket.on('joinRoom', (roomName, respond) => {
		if (rooms.has(roomName)) {
			socket.join(roomName);
			io.sockets.in(roomName).emit("saysomething", "hello everyone");
		} else {
			respond({status: "error", msg: "wrong room"});
		}
	});
	socket.emit('hi',"hello");
});

server.listen(3000);
