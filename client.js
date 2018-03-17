const SOCKET = io();
const IMAGE = 'img/player.png';
let GAME = "";
const GAME_X = 500;
const GAME_Y = 500;
const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 100;
const SPEED = 10;
var NAME = '';
var players = [];
var player = '';

document.addEventListener("DOMContentLoaded", function(event) {
  GAME = document.getElementById('game');
});

function spawnPlayer() {
  NAME = SOCKET.id;
  player = document.createElement('img');
  player.src = IMAGE;
  player.alt = NAME;
  player.width = PLAYER_WIDTH;
  player.height = PLAYER_HEIGHT;
  player.style.left = getRandomNumber(0, GAME_X - PLAYER_WIDTH) + 'px';
  player.style.top = getRandomNumber(0, GAME_Y - PLAYER_HEIGHT) + 'px';
  var position = {
    X: Number(player.style.left.replace('px', '')),
    Y: Number(player.style.top.replace('px', ''))
  };
  GAME.appendChild(player);
  SOCKET.emit('new', position);
}

function createPlayer(name, x, y) {
  var newplayer = document.createElement('img');
  newplayer.src = IMAGE;
  newplayer.alt = name;
  newplayer.width = PLAYER_WIDTH;
  newplayer.height = PLAYER_HEIGHT;
  newplayer.style.left = x + 'px';
  newplayer.style.top = y + 'px';
  GAME.appendChild(newplayer);
  return newplayer;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function move(event) {
  var key = event.code;
  var position = {
    X: Number(player.style.left.replace('px', '')),
    Y: Number(player.style.top.replace('px', ''))
  };
  if (key == 'KeyW') {
    position.Y -= SPEED;
  } else if (key == 'KeyA') {
    position.X -= SPEED;
  } else if (key == 'KeyS') {
    position.Y += SPEED;
  } else if (key == 'KeyD') {
    position.X += SPEED;
  }

  if (position.X < 0) {
    position.X = 0;
  } else if (position.X > GAME_X - PLAYER_WIDTH) {
    position.X = GAME_X - PLAYER_WIDTH;
  } else if (position.Y < 0) {
    position.Y = 0;
  } else if (position.Y > GAME_Y - PLAYER_HEIGHT) {
    position.Y = GAME_Y  - PLAYER_HEIGHT;
  }
  console.log('Mando la mia posizione');
  SOCKET.emit('move', position);
}

SOCKET.on('new', function(data) {
  console.log('Carico i giocatori');
  for (var i = 0; i < data.length; i++) {
    var p = '';
    if (data[i].name != NAME) {
      p = createPlayer(data[i].name, data[i].x, data[i].y);
    } else {
      p = player;
    }
    players.push({element: p, name: data[i].name, x: data[i].x, y: data[i].y});
  }
});

SOCKET.on('update', function(data) {
  console.log('Nuovo giocatore connesso');
  var p = createPlayer(data.name, data.x, data.y);
  players.push({element: p, name: data.name, x: data.x, y: data.y});
});

SOCKET.on('move', function(data) {
  console.log('Aggiorno le posizioni');
  for (var a = 0; a < data.length; a++) {
    for (var i = 0; i < players.length; i++) {
      if (data[a].name == players[i].name) {
        players[i].element.style.top = Number(data[a].y) + 'px';
        players[i].element.style.left = Number(data[a].x) + 'px';
        break;
      }
    }
  }
});

SOCKET.on('quit', function(data) {
  console.log('Un utente si è disconnesso');
  for (var i = 0; i < players.length; i++) {
    if (players[i].name == data.name) {
      players[i].element.remove();
      removeArray(players[i], players);
      break;
    }
  }
});

function removeArray(name, array) {
  var index = array.indexOf(name);
  if (index > -1) {
    array.splice(index, 1);
  }
}
