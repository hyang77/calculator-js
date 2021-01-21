export default class Calculator {
  constructor(previousTextOutput, currentTextOutput) {
    this.previousTextOutput = previousTextOutput;
    this.currentTextOutput = currentTextOutput;
    this.calculation = "";
    this.calculationsArray = this.initCalculationsArray(); // Get array from session storage
    this.updateCalculationResults();
    this.isFinished = false;
    this.clearAllNumbers();
  }

  // Empty outputs on the calculator screen
  clearAllNumbers() {
    this.currentValue = "";
    this.previousValue = "";
    this.operator = "";
    this.calculation = "";
    this.isFinished = false;
    this.updateCalculatorOutput();
  }

  // Delete the last number
  deleteNumber() {
    this.currentValue = this.currentValue.toString().slice(0, -1);
    this.updateCalculatorOutput();
  }

  // Add a number
  appendNumber(number) {
    // Empty outputs if the calculatuin is completed
    if (this.isFinished) {
      this.clearAllNumbers();
    }
    this.currentValue += number;
    this.updateCalculatorOutput();
  }

  clickOperatorButton(operator) {
    if (this.currentValue !== "") {
      // Variables to calculate the numbers
      let prev = parseFloat(this.previousValue);
      let curr = parseFloat(this.currentValue);

      if (this.previousValue !== "") {
        switch (this.operator) {
          case "+":
            prev += curr;
            break;
          case "-":
            prev -= curr;
            break;
          case "×":
            prev *= curr;
            break;
          case "÷":
            prev /= curr;
            break;
          default:
            return;
        }
        this.previousValue = prev;
        this.calculation += this.operator;
        this.calculation += this.currentValue;
      } else {
        this.previousValue = this.currentValue;
        this.calculation += this.currentValue;
      }
      this.currentValue = "";
    }
    // Update the operator
    this.operator = operator;
    this.updateCalculatorOutput();
  }

  clickEqualsButton() {
    this.clickOperatorButton("=");
    if (this.calculation !== "") {
      this.currentValue = this.previousValue;
      this.previousValue = "";
      // Prevent duplicate calculations
      if (!this.isFinished) {
        this.calculation += "=";
        this.calculation += this.currentValue;
        this.addCalculation(this.calculation);
        this.updateCalculationResults();
        this.isFinished = true;
      }
      this.updateCalculatorOutput();
    }
  }

  // Add a calculation into calculationsArray
  addCalculation(calculation) {
    this.calculationsArray.push(calculation);

    // Control calculationsArray not to store more than ten elements
    if (this.calculationsArray.length > 10) {
      // Remove the oldest calculation
      this.calculationsArray.splice(0, 1);
    }
    // Store calculation results in SessionStorage
    sessionStorage.setItem(
      "ListCalculations",
      JSON.stringify(this.calculationsArray)
    );
  }

  // Get calculation results from the session storage
  initCalculationsArray() {
    var initArray = [];
    if (sessionStorage.getItem("ListCalculations")) {
      initArray = JSON.parse(sessionStorage.getItem("ListCalculations"));
    }
    return initArray;
  }

  // For socket.io to emit latest calculation
  getLastCalculation() {
    return this.calculationsArray[this.calculationsArray.length - 1];
  }

  // Refresh the calculation results
  updateCalculationResults() {
    const container = document.querySelector(".log-calculations");
    // Empty all calculation results displayed on the screen
    container.innerHTML = "";
    // Iterate calculationsArray to add calculation results on the screen
    this.calculationsArray.forEach((calculation) => {
      const item = document.createElement("li");
      item.className = "calculation";
      item.innerText = calculation;
      container.prepend(item);
    });
  }

  // Update the output on the calculator screen
  updateCalculatorOutput() {
    this.previousTextOutput.innerText = this.previousValue;
    this.currentTextOutput.innerText = this.currentValue;
  }
}
