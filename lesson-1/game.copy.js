var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
  // LED Lights
  var redLed = new five.Led(3);
  var blueLed = new five.Led(6);
  var greenLed = new five.Led(9);
  var ledCollection = [redLed, blueLed, greenLed];

  // Buttons
  var redLedButton = new five.Button(4);
  var blueLedButton = new five.Button(7);
  var greenLedButton = new five.Button(10);
  var gameStartButton = new five.Button(12);

  // Red LED Button Pushed
  redLedButton.on("down", function () {
    redLed.on();
  });

  redLedButton.on("up", function () {
    redLed.off();
  });

  // Blue LED Button Pushed
  blueLedButton.on("down", function () {
    blueLed.on();
  });

  blueLedButton.on("up", function () {
    blueLed.off();
  });

  // Green LED Button Pushed
  greenLedButton.on("down", function () {
    greenLed.on();
  });

  greenLedButton.on("up", function () {
    greenLed.off();
  });

  // Game start Button Pushed
  gameStartButton.on("down", async function() {
    await flashAllLights();

    var ledOrder = [
      getRandomLedPosition(),
      getRandomLedPosition(),
      getRandomLedPosition()
    ];

    await playLEDsInOrder(ledOrder);
  });


  // Helper functions!
  async function playLEDsInOrder(orderToPlay) {
    for (var index = 0; index < orderToPlay.length; index++) {
      const ledPositionAtIndex = orderToPlay[index];
      ledCollection[ledPositionAtIndex].on();
      await sleep(500);
      ledCollection[ledPositionAtIndex].off();
      await sleep(500);
    }
  }

  async function flashAllLights() {
    blueLed.on();
    redLed.on();
    greenLed.on();

    await sleep(1250);

    blueLed.off();
    redLed.off();
    greenLed.off();

    await sleep(500);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getRandomLedPosition() {
    return Math.floor(Math.random() * 3);
  }
});

