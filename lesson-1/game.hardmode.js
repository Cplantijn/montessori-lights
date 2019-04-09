var five = require("johnny-five");
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

  // Red LED Button Pushed
  redLedButton.on("down", function () {
    if (waitingForPlayer) {
      redLed.on();
      checkOrdering(0);
    }
  });

  redLedButton.on("up", function () {
    redLed.off();
  });


  // Blue LED Button Pushed
  blueLedButton.on("down", function () {
    if (waitingForPlayer) {
      blueLed.on()
      checkOrdering(1);
    }
  });

  blueLedButton.on("up", function () {
    blueLed.off();
  });


  // Green LED Button Pushed
  greenLedButton.on("down", function () {
    if (waitingForPlayer) {
      greenLed.on();
      checkOrdering(2);
    }
  });

  greenLedButton.on("up", function () {
    greenLed.off();
  });


  // Start Button Pushed
  startButton.on("down", async function () {
    playerScore = 0;
    round = 0;

    await sleep(1000);
    await startNewGame();
  });



  // Helper functions
  async function startNewGame() {
    ledOrdering = [
      getRandomLedPosition(),
      getRandomLedPosition(),
      getRandomLedPosition()
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

      if (ledOrdering.length == 0) {
        playerScore = playerScore + (300 * (round + 1));

        await sleep(500);
        round = round + 1;
        startNewGame();
      }
    } else {
      // Game over!
      endGame();
    }
  }

  async function endGame() {
    waitingForPlayer = false;
    console.log('============================');
    console.log(`Player score: ${playerScore}`);
    console.log(`Rounds survived: ${round}`);
    console.log('============================');
  }

  async function playLightsInOrderGiven(order) {
    for(let i = 0; i < order.length; i++) {
      ledArray[order[i]].on();
      await sleep(250);
      ledArray[order[i]].off();
      await sleep(250);
    }
  }

  function getRandomLedPosition() {
    return Math.floor(Math.random() * 3);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});


