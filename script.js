const display = document.querySelector("#display");
const expression = document.querySelector("#expression");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let waitingForOperand = false;
let hasError = false;

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  const roundedValue = Number(value.toPrecision(12));
  return Object.is(roundedValue, -0) ? "0" : String(roundedValue);
}

function updateDisplay() {
  display.textContent = hasError ? "Cannot divide by zero" : currentInput;
  expression.textContent = storedValue !== null && pendingOperator
    ? `${formatNumber(storedValue)} ${getOperatorSymbol(pendingOperator)}`
    : "\u00a0";
}

function getOperatorSymbol(operator) {
  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  return symbols[operator];
}

function clearCalculator() {
  currentInput = "0";
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  hasError = false;
  updateSelectedOperator();
  updateDisplay();
}

function inputDigit(digit) {
  if (hasError) {
    clearCalculator();
  }

  if (waitingForOperand) {
    currentInput = digit;
    waitingForOperand = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else if (currentInput === "-0") {
    currentInput = `-${digit}`;
  } else if (currentInput.length < 16) {
    currentInput += digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (hasError) {
    clearCalculator();
  }

  if (waitingForOperand) {
    currentInput = "0.";
    waitingForOperand = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

function calculate(left, right, operator) {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return right === 0 ? null : left / right;
    default:
      return null;
  }
}

function chooseOperator(operator) {
  if (hasError) {
    clearCalculator();
  }

  const inputValue = Number(currentInput);

  if (pendingOperator && !waitingForOperand) {
    const result = calculate(storedValue, inputValue, pendingOperator);
    const formattedResult = result === null ? null : formatNumber(result);

    if (formattedResult === null) {
      showError();
      return;
    }

    currentInput = formattedResult;
    storedValue = Number(formattedResult);
  } else if (storedValue === null || !waitingForOperand) {
    storedValue = inputValue;
  }

  pendingOperator = operator;
  waitingForOperand = true;
  updateSelectedOperator();
  updateDisplay();
}

function calculateResult() {
  if (hasError || pendingOperator === null || waitingForOperand) {
    return;
  }

  const rightValue = Number(currentInput);
  const result = calculate(storedValue, rightValue, pendingOperator);
  const formattedResult = result === null ? null : formatNumber(result);

  if (formattedResult === null) {
    showError();
    return;
  }

  expression.textContent = `${formatNumber(storedValue)} ${getOperatorSymbol(pendingOperator)} ${formatNumber(rightValue)} =`;
  currentInput = formattedResult;
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = true;
  updateSelectedOperator();
  display.textContent = currentInput;
}

function showError() {
  currentInput = "0";
  storedValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  hasError = true;
  updateSelectedOperator();
  updateDisplay();
}

function backspace() {
  if (hasError) {
    clearCalculator();
    return;
  }

  if (waitingForOperand) {
    currentInput = "0";
    waitingForOperand = false;
  } else if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "-") {
      currentInput = "0";
    }
  } else {
    currentInput = "0";
  }

  updateDisplay();
}

function toggleSign() {
  if (hasError) {
    clearCalculator();
    return;
  }

  currentInput = currentInput.startsWith("-")
    ? currentInput.slice(1)
    : `-${currentInput}`;
  updateDisplay();
}

function updateSelectedOperator() {
  keypad.querySelectorAll("[data-operator]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.operator === pendingOperator);
  });
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  if (button.dataset.number !== undefined) {
    inputDigit(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else {
    switch (button.dataset.action) {
      case "clear":
        clearCalculator();
        break;
      case "decimal":
        inputDecimal();
        break;
      case "equals":
        calculateResult();
        break;
      case "backspace":
        backspace();
        break;
      case "sign":
        toggleSign();
        break;
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) {
    inputDigit(event.key);
  } else if (event.key === "." || event.key === ",") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(event.key)) {
    event.preventDefault();
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculateResult();
  } else if (event.key === "Backspace") {
    event.preventDefault();
    backspace();
  } else if (event.key === "Escape" || event.key === "Delete") {
    clearCalculator();
  }
});

updateDisplay();
