var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
  // LED Lights
  var redLed = new five.Led(3);
  var blueLed = new five.Led(6);
  var greenLed = new five.Led(9);
  var ledArray = [redLed, blueLed, greenLed];

  // Buttons
  var redLedButton = new five.Button(4);
  var blueLedButton = new five.Button(7);
  var greenLedButton = new five.Button(10);
  var newGameButton = new five.Button(12);

  // Game Logic
  var ledOrder = [];
  var waitingForPlayer = false;

  // Red LED Button Pushed
  redLedButton.on("down", function () {
    if (waitingForPlayer) {
      redLed.on();
      checkLedOrder(0);
    }
  });

  redLedButton.on("up", function () {
    redLed.off();
  });

  // Blue LED Button Pushed
  blueLedButton.on("down", function () {
    if (waitingForPlayer) {
      blueLed.on();
      checkLedOrder(1);
    }
  });

  blueLedButton.on("up", function () {
    blueLed.off();
  });

  // Green LED Button Pushed
  greenLedButton.on("down", function () {
    if (waitingForPlayer) {
      greenLed.on();
    }
  });

  greenLedButton.on("up", function () {
    greenLed.off();
  });

  newGameButton.on("down", async function() {
    ledOrder = [
      getRandomLedPosition(),
      getRandomLedPosition(),
      getRandomLedPosition()
    ];

    await playLedsInOrderGiven(ledOrder);
    waitingForPlayer = true;
  });

  // Helpers
  function checkLedOrder(position) {
    if (ledOrder.length > 0) {
      if (ledOrder[0] == position) {
        // Player guessed right
        ledOrder.shift();
      } else {
        waitingForPlayer = false;
        console.log("GAME OVER!");
      }
    }
  }

  async function playLedsInOrderGiven(ledOrder) {
    console.log('Order given', ledOrder);
    for (var i = 0; i < ledOrder.length; i = i + 1) {
      console.log('Value of i is now', i);
      var ledPosition = ledOrder[i];
      console.log('Playing LED at position', ledPosition);
      ledArray[ledPosition].on();
      await sleep(500);
      ledArray[ledPosition].off();
      await sleep(500);
    }
  }

  function getRandomLedPosition() {
    return Math.floor(Math.random() * 3);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});