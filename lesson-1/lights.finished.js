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
    await blinkAllLeds();
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

    await playLightsInOrderGiven(ledOrdering);
    console.log("Now waiting for player");
    waitingForPlayer = true;
  }

  async function checkOrdering(positionGuess) {
    if (positionGuess == ledOrdering[0]) {
      ledOrdering.shift();

      if (ledOrdering.length == 0) {
        await sleep(500);
        startNewGame();
      }
    } else {
      // Game over!
      waitingForPlayer = false;
      redLed.blink(100);
      await sleep(4000);
      redLed.stop();
      redLed.off();
    }
  }

  async function playLightsInOrderGiven(order) {
    console.log("Starting new game");
    // First Led
    ledArray[order[0]].on();
    await sleep(250);
    ledArray[order[0]].off();
    await sleep(250);

    // Second Led
    ledArray[order[1]].on();
    await sleep(250);
    ledArray[order[1]].off();
    await sleep(250);

    // Third Led
    ledArray[order[2]].on();
    await sleep(250);
    ledArray[order[2]].off();
    await sleep(250);
  }

  async function blinkAllLeds() {
    // Blink all LEDS
    redLed.blink(250);
    blueLed.blink(250);
    greenLed.blink(250);

    await sleep(1500);
    // Stop and turn off Red Led
    redLed.stop();
    redLed.off();

    // Stop and turn off Blue Led
    blueLed.stop();
    blueLed.off();

    // Stop and turn off Green Led
    greenLed.stop();
    greenLed.off();
  }

  function getRandomLedPosition() {
    return Math.floor(Math.random() * 3);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});


