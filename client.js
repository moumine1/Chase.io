const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const messages = document.getElementById('messages');
const form = document.getElementById('message-form');
const input = form.querySelector('input');

let localplayer = null;
let localposition_x = 0;
let localposition_y = 0;
let players = [];   

window.addEventListener("DOMContentLoaded", ()=>{
    if(!localplayer){
    socket.emit('settings', players);
    }
}, false);

// Gérer les événements clavier pour le déplacement du joueur
window.addEventListener('keydown', (event) => {
  event.preventDefault();
	if (!localplayer) return;
	switch (event.code) {
		case "ArrowUp":
    case "KeyW":
    localposition_x = sessionStorage.getItem("playerposition_z");
    localposition_y = sessionStorage.getItem("playerposition_x");
	}
  socket.emit('player-move', localplayer, localposition_x, localposition_y);
});

// Créer la connexion avec le serveur
const socket = io();

socket.on('connect', () => {
  console.log('Connecté au serveur.');

    // Gérer la mise à jour de la carte et des joueurs
    socket.on('map-update', (map) => {
    players = map.players.reduce((acc, localplayer) => {
        acc[localplayer.id] = localplayer;
        return acc;
    }, {});
    document.querySelector("#game-canvas").style.opacity = 1;
    draw();
    });

    // Gérer la mise à jour des positions des joueurs
    socket.on('player-move', (player) => {
    players[player.id] = player;
    draw();
    });

    // Gérer l'arrivée d'un nouveau joueur
    socket.on('player-join', (player) => {
      players[player.id] = player;
      localplayer = player;
    });

    // Gérer la déconnexion d'un joueur
    socket.on('player-leave', (player) => {
    delete players[player.id];
    draw();
    });
    
});

// Récupérer la carte
const map = {
  width: 540,
  height: 280,
  walls: [
    //mur 5-8
    // Exemple mur 5 : createGeom(30,0,30,150,20),
    { x: 0, y: 250, width: 150, height: 1 },
    { x: 150, y: 220, width: 1, height: 30 },
    { x: 150, y: 220, width: 40, height: 1 },
    { x: 110, y: 220, width: 1, height: 30 },

    //mur 10-11
    { x: 110, y: 160, width: 1, height: 30 },
    { x: 0, y: 160, width: 150, height: 1 },


    //mur 12-17
    { x: 220, y: 220, width: 110, height: 1 },
    { x: 230, y: 160, width: 1, height: 60 },
    { x: 180, y: 160, width: 50, height: 1 },
    { x: 250, y: 220, width: 1, height: 20 },
    { x: 250, y: 270, width: 1, height: 10 },
    { x: 330, y: 220, width: 1, height: 60 },

    //mur 18-20
    { x: 360, y: 190, width: 1, height: 60 },
    { x: 360, y: 250, width: 120, height: 1 },
    { x: 480, y: 235, width: 1, height: 15 },

    //mur 21-22
    { x: 480, y: 190, width: 1, height: 15 },
    { x: 430, y: 190, width: 110, height: 1 },

    //mur 23
    { x: 460, y: 90, width: 80, height: 1 },

    //mur 24
    { x: 500, y: 30, width: 40, height: 1 },

    //mur 25-27
    { x: 310, y: 30, width: 160, height: 1 },
    { x: 340, y: 30, width: 1, height: 80 },
    { x: 340, y: 90, width: 90, height: 1 },

    //mur 28-30
    { x: 340, y: 140, width: 1, height: 50 },
    { x: 260, y: 190, width: 140, height: 1 },
    { x: 260, y: 95, width: 1, height: 95 },

    //mur 31-39 aussi dans les backrooms

    //mur 40-42
    { x: 260, y: 0, width: 1, height: 65 },
    { x: 70, y: 30, width: 210, height: 1 },
    { x: 118, y: 30, width: 1, height: 35 },

    //mur 43-45
    { x: 20, y: 30, width: 20, height: 1 },
    { x: 20, y: 30, width: 1, height: 90 },
    { x: 20, y: 120, width: 20, height: 1 },

    //mur 46-47
    { x: 70, y: 120, width: 90, height: 1 },
    { x: 118, y: 95, width: 1, height: 25 },
    
    //mur 48
    { x: 190, y: 120, width: 70, height: 1 }
  ]
};

// Dessiner la carte et les joueurs
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner les murs
  ctx.fillStyle = 'gray';
  map.walls.forEach((wall) => {
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
  });

  // Dessiner les joueurs
  Object.keys(players).forEach((id) => {
    const p = players[id];
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
  
}

// Demander le nom du joueur et se connecter
function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

let nomvalide = false;
nom = null;
while (nomvalide == false)
{
  nom = prompt('Entrez votre nom :');
  if (nom != "" && hasWhiteSpace(nom) != true) {
    if (nom.length <= 20) {
      console.log("Passed");
      nomvalide = true;
      document.querySelector("#lobby-pseudo").innerHTML = "PSEUDO : " + nom;
    } else {
      alert("Veuillez ne pas dépasser 20 charactères.");
    }
  } else {
    alert("Veuillez ne pas laissez d'espace.");
  }
}

let ingame = false;
// Rejoindre la salle d'attente
document.querySelector("#Play").addEventListener("click", (event) =>{
  document.querySelector("#start-menu").style.display = "none";
  document.querySelector("#wait-menu").style.display = "flex";
  
  socket.emit('player-join', { nom });

  socket.on('player-count', (names) => {
    document.querySelector("#waiting").innerHTML = "En attente : " + names.length;

    const playerlist = document.querySelector("#player-list");

    while (playerlist.firstChild) {
      playerlist.removeChild(playerlist.lastChild);
    }

    for (i in names) {
      playerlist.appendChild(document.createElement("p")).innerHTML = names[i];
    }

    if (names.length >= 3 && ingame == false)
    {
        document.querySelector("#Ready").style.display = "block";
    }
  });
});

// Démarrer une partie
let countdown = false;
let timer = 10;
let ready_er = true;
document.querySelector("#Ready").addEventListener("click", (event) =>{
  socket.emit('ready', localplayer);
});

socket.on('ready', (readycount, starttimer, size) => {
  document.querySelector("#Ready").innerHTML = "Prêt : " + readycount + "/" + Math.round(size/2);

  if (starttimer == true && ready_er == true)
  {
    ready_er = false;
    document.querySelector("#start-timer").style.display = "block";
    var attente = setInterval(async function() {
      document.querySelector("#start-timer").innerHTML = timer + "s";

      if (timer <= 0) {
        clearInterval(attente);
        document.querySelector("#start-timer").innerHTML = "Lancement de la partie.";
        timer = 5;
        var chat = setInterval(async function() {
          timer--;

          if (timer <= 0) {
            clearInterval(chat);
            socket.emit('start-game', localplayer);
          }
        }, 1000);
      }
      timer--;
    }, 1000);
  } else {
    clearInterval(attente);
    clearInterval(chat);
    timer = 10;
  }
});

// Lancement de la partie
socket.on('start-chase', (randomizer) =>{
  timer = 10;
  document.querySelector('#Ready').style.display = "none";
  document.querySelector('.lobby').style.display = "none";
  const demarrage = new Event("demarrage");
  document.dispatchEvent(demarrage);
});

// Dessiner la carte initiale
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = input.value;

    if (message && nom) {
      const data = {
        nom,
        message
      };

      socket.emit('chat:message', data);
      input.value = '';
    }
  });

  socket.on('chat:message', (data) => {
    const message = document.createElement('li');
    message.innerText = `[${data.nom}]: ${data.message}`;
    messages.appendChild(message);
  });
