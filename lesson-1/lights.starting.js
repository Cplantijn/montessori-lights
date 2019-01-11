var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
  // LED Lights
  var redLed = new five.Led(3);
  var blueLed = new five.Led(6);
  var greenLed = new five.Led(9);

  // Buttons
  var redLedButton = new five.Button(4);
  var blueLedButton = new five.Button(7);
  var greenLedButton = new five.Button(10);

  // Red LED Button Pushed
  redLedButton.on("down", function() {
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
  greenLedButton.on("down", function() {
    greenLed.on();
  });

  greenLedButton.on("up", function () {
    greenLed.off();
  });
});