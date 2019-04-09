var five = require("johnny-five");
const fastify = require('fastify')();
const path = require('path');
const uuid = require('uuid/v4');
const connectedClients = {};

var board = new five.Board();
board.on("ready", function () {
  // LED Lights
  var redLed = new five.Led(3);
  var blueLed = new five.Led(6);
  var greenLed = new five.Led(9);
  var ledArray = [redLed, blueLed, greenLed];

  // Buttons
  var startButton = new five.Button(12);
  var redLedButton = new five.Button(4);
  var blueLedButton = new five.Button(7);
  var greenLedButton = new five.Button(10);

  // Game logic
  var ledOrdering = [];
  var waitingForPlayer = false;
  var playerScore = 0;
  var round = 0;
  var speed = 500;

  // Red LED Button Pushed
  redLedButton.on("down", function () {
    if (waitingForPlayer) {
      redLed.on();
      redLed.brightness(60);
      checkOrdering(0);
    }
  });

  redLedButton.on("up", function () {
    redLed.off();
  });


  // Blue LED Button Pushed
  blueLedButton.on("down", function () {
    if (waitingForPlayer) {
      blueLed.on();
      blueLed.brightness(60);
      checkOrdering(1);
    }
  });

  blueLedButton.on("up", function () {
    blueLed.off();
  });


  // Green LED Button Pushed
  greenLedButton.on("down", async function () {
    if (waitingForPlayer) {
      greenLed.on();
      greenLed.brightness(60);
      checkOrdering(2);
    }
  });

  greenLedButton.on("up", function () {
    greenLed.off();
  });


  // Start Button Pushed
  startButton.on("down", async function () {
    playerScore = 0;
    round = 1;
    speed = 500;

    sendMessageToAll({ code: 'NEW_GAME' });
    await sleep(2000);
    await startNewGame();
  });

  // Helper functions
  async function startNewGame() {
    ledOrdering = [
      getRandomLedPosition(),
    ];

    for (let i = 0; i < round; i++) {
      ledOrdering.push(getRandomLedPosition());
    }

    await playLightsInOrderGiven(ledOrdering);
    waitingForPlayer = true;
  }

  async function checkOrdering(positionGuess) {
    if (positionGuess == ledOrdering[0]) {
      ledOrdering.shift();
      playerScore = playerScore + 100;
      sendMessageToAll({ code: 'UPDATE_SCORE', playerScore });

      if (ledOrdering.length == 0) {
        round = round + 1;
        
        sendMessageToAll({ code: 'ROUND_ADVANCED', round});
        speed = (speed - 100 > 100) ? speed - 100 : 100;
        await sleep(1000);
        startNewGame();
      }
    } else {
      // Game over!
      endGame();
    }
  }

  async function endGame() {
    waitingForPlayer = false;
    sendMessageToAll({ code: 'GAME_OVER', round, playerScore });
  }

  async function playLightsInOrderGiven(order) {
    for (let i = 0; i < order.length; i++) {
      if (ledArray[order[i]]) {
        ledArray[order[i]].on();
        ledArray[order[i]].brightness(60);
        await sleep(speed);
        ledArray[order[i]].off();
        await sleep(speed);
      }
    }
  }

  function getRandomLedPosition() {
    return Math.floor(Math.random() * 3);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});













/* SERVER */
const PORT = 3000;

fastify.register(require('fastify-ws'));
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'app'),
  prefix: '/app/',
});

fastify.get('/', (req, res) => res.sendFile('index.html'));

fastify.ready(err => {
  if (err) throw err;

  fastify.ws.on('connection', socket => {
    const socketId = uuid();
    connectedClients[socketId] = socket;

    socket.on('close', () => {
      delete connectedClients[socketId];
    });
  });
});

fastify.listen(PORT, '0.0.0.0', () => console.log(`Lights game is running on port ${PORT}!`));


function sendMessageToAll(msg) {
  Object.keys(connectedClients).forEach(clientId => {
    connectedClients[clientId].send(JSON.stringify(msg));
  });
}