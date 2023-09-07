const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/'));

const players = [];
const readyplayers = [];
let counter = 0;

io.on('connect', (socket) => {
  console.log(`Connecté : ${socket.id}`);

  socket.on('settings', (ps)=>{
    ps = players;
    io.emit('settings', ps);
  });

  //socket.emit('state', { players });

  // Gérer l'arrivée d'un nouveau joueur
  socket.on('player-join', (player) => {
    console.log(`Joueur rejoint : ${player.nom}`);
    player.id = socket.id;
    player.x = Math.floor(Math.random() * 535);
    player.y = Math.floor(Math.random() * 275);
    players.push(player);
    io.to(player.id).emit('player-join', player);
    let i = 0;
    const names = [];
    for (var obj in players) {
      names[i] = players[obj]["nom"];
      i++;
    };
    io.emit('player-count', names);
  });

  // Gérer le lancement d'une partie
  socket.on('ready', (player) => {
    console.log(`${player.nom} est prêt à jouer.`);
    const p = readyplayers.find((p) => p.id === player.id);
    if (p)
    {
      readyplayers.splice(readyplayers.indexOf(player), 1)
    } else {
      readyplayers.push(player);
    }
    let readycount = readyplayers.length;
    let starttimer = null;
    let size = players.length;
    if (Math.round(size/2) <= readycount)
    {
      starttimer = true;
    } else {
      starttimer = false;
    }
    io.emit('ready', readycount, starttimer, size);
  })

  // GO GO GO !
  socket.on('start-game', (player) => {
    counter++;
    if (counter == players.length) {
      let randomInt = Math.floor(Math.random() * counter);
      let randomizer = players[randomInt]["nom"];
      io.emit('start-chase', randomizer);
      io.emit('map-update', { players });
    }
  })

  // Gérer le déplacement d'un joueur
  socket.on('player-move', (player, localposition_x, localposition_z) => {
    const p = players.find((p) => p.id === player.id);
    p.x = localposition_x;
    p.y = localposition_z;
    io.emit('player-move', p);
  });

  // Gérer la déconnexion d'un joueur
  socket.on('disconnect', () => {
    console.log(`Déconnecté : ${socket.id}`);
    const player = players.find((p) => p.id === socket.id);
    if (player) {
      io.emit('player-leave', player);
      players.splice(players.indexOf(player), 1);
      readyplayers.splice(readyplayers.indexOf(player), 1)
      counter--;
    }
  });

  socket.on('chat:message', (data) => {
    console.log(`[${data.nom}]: ${data.message}`);
    io.emit('chat:message', data);
  });
});

server.listen(8083, () => {
  console.log('Serveur démarré sur le port 8083.');
});
