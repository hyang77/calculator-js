import Calculator from "./calculator.js";
// Enable WebSocket sonnection on the cient side
const socket = io();

window.addEventListener("DOMContentLoaded", (event) => {
  // Add DOM elements for the calculator
  const numberButtons = document.querySelectorAll("[data-number]");
  const operatorButtons = document.querySelectorAll("[data-operator]");
  const equalsButton = document.querySelector("[data-equals]");
  const deleteButton = document.querySelector("[data-delete]");
  const clearButton = document.querySelector("[data-clear]");
  const previousTextOutput = document.querySelector("[data-previous-output]");
  const currentTextoutput = document.querySelector("[data-current-output]");

  // Create an instance of an object "Calaulator"
  const calculator = new Calculator(previousTextOutput, currentTextoutput);

  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      calculator.appendNumber(button.innerText);
    });
  });

  operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      calculator.clickOperatorButton(button.innerText);
    });
  });

  clearButton.addEventListener("click", () => {
    calculator.clearAllNumbers();
  });

  deleteButton.addEventListener("click", () => {
    calculator.deleteNumber();
  });

  equalsButton.addEventListener("click", () => {
    calculator.clickEqualsButton();
    // Trigger event and send calculations data back to the server
    socket.emit("display calculations", calculator.getLastCalculation());
  });

  // Listen for a custom socket event to update calculations on everyone's screen
  socket.on("display calculations", (calculation) => {
    calculator.addCalculation(calculation);
    calculator.updateCalculationResults();
  });
});
