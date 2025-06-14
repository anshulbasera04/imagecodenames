
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

let gameState = {
  players: {},
  board: [],
  clues: [],
  redTeam: [],
  blueTeam: [],
};

io.on('connection', (socket) => {
  console.log('New client:', socket.id);

  socket.on('joinGame', ({ playerName, team }) => {
    gameState.players[socket.id] = { playerName, team };
    gameState[team].push(socket.id);
    io.emit('updatePlayers', gameState.players);
  });

  socket.on('startGame', () => {
    gameState.board = generateBoard();
    io.emit('gameStarted', gameState.board);
  });

  socket.on('sendClue', (clue) => {
    gameState.clues.push(clue);
    io.emit('newClue', clue);
  });

  socket.on('selectImage', (imageIndex) => {
    io.emit('imageSelected', imageIndex);
  });

  socket.on('disconnect', () => {
    delete gameState.players[socket.id];
    io.emit('updatePlayers', gameState.players);
  });
});

function generateBoard() {
  const images = [
    'tree.png', 'mountain.png', 'camera.png', 'robot.png', 'globe.png',
    'laptop.png', 'clapper.png', 'avatar1.png', 'avatar2.png', 'binoculars.png',
    'leaf.png', 'cloud.png', 'sun.png', 'moon.png', 'book.png',
    'red.png', 'blue.png', 'neutral.png', 'assassin.png'
  ];
  return images.sort(() => 0.5 - Math.random()).slice(0, 25);
}

server.listen(process.env.PORT || 4000, () => console.log('Server running'));
