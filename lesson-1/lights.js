var five = require("johnny-five");
var random = require("random");

var board = new five.Board();

board.on("ready", function () {
  // Game Logic
  var ledOrder = [];

  // LED Lights
  var redLed = new five.Led(3);
  var blueLed = new five.Led(6);
  var greenLed = new five.Led(9);
  var allLeds = [redLed, blueLed, greenLed];

  // Buttons
  var newGameButton = new five.Button(12);
  var redLedButton = new five.Button(4);
  var blueLedButton = new five.Button(7);
  var greenLedButton = new five.Button(10);

  // Red LED Button Pushed
  redLedButton.on("down", function() {
    redLed.on();
    checkOrder(0);
  });

  redLedButton.on("up", function () {
    redLed.off();
  });

  // Blue LED Button Pushed
  blueLedButton.on("down", function () {
    blueLed.on();
    checkOrder(1);
  });

  blueLedButton.on("up", function () {
    blueLed.off();
  });

  // Green LED Button Pushed
  greenLedButton.on("down", function() {
    greenLed.on();
    checkOrder(2);
  });

  greenLedButton.on("up", function () {
    greenLed.off();
  });

  // New game button pushed down
  newGameButton.on("down", async function() {
    redLed.blink(250);
    blueLed.blink(250);
    greenLed.blink(250);

    await sleep(1500);
    turnOffAllLights();

    await sleep(1000);

    playNewRound();
  });

  async function playNewRound() {
    // Choose all Leds
    ledOrder = makeNewOrder();

    //Turn on First LED in order
    allLeds[ledOrder[0]].on();
    await sleep(250);
    allLeds[ledOrder[0]].off();
    await sleep(250);

    //Turn on Second LED in order
    allLeds[ledOrder[1]].on();
    await sleep(250);
    allLeds[ledOrder[1]].off();
    await sleep(250);

    //Turn on Third LED in order
    allLeds[ledOrder[2]].on();
    await sleep(250);
    allLeds[ledOrder[2]].off();
    await sleep(250);
  }

  async function checkOrder(ledPosition) {
    if (ledOrder.length) {
      if (ledOrder[0] == ledPosition) {
        if (ledOrder.length === 1) {
          redLed.blink(250);
          blueLed.blink(250);
          greenLed.blink(250);

          await sleep(1500);
          
          turnOffAllLights();

          await sleep(1000);
          playNewRound();
        } else {
          ledOrder.shift();
        }
      } else {
        redLed.blink(125);
        await sleep(1000);
        redLed.stop().off();
      }
    }
  }

  function turnOffAllLights() {
    redLed.stop().off();
    blueLed.stop().off();
    greenLed.stop().off();
  }
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeNewOrder() {
  return [random.int(0, 2), random.int(0, 2), random.int(0, 2)]
}