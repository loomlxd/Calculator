import "./style.css";
import refs from "./refs";

let firstNumber = 0;
let secondNumber = 0;
let symbol = null;
let total = 0;
let dotCount = 0;
let localStorageHistory = [];

if (localStorage.getItem("history") !== null) {
  localStorageHistory = localStorage.getItem("history").split(",");
}

upDateHistory();

refs.keyPads.addEventListener("click", onKeyPadsClick);

function onKeyPadsClick(e) {
  if (e.target.tagName !== "LI") {
    return;
  }

  if (e.target.classList.contains("number")) {
    const number = e.target.textContent;

    if (symbol === "/" && e.target.textContent === "0") {
      return;
    }
    if (
      (refs.display.textContent === "" && e.target.textContent === ".") ||
      (refs.display.textContent === " - " && e.target.textContent === ".")
    ) {
      return;
    }
    if (dotCount === 1 && e.target.textContent === ".") {
      return;
    }
    if (refs.display.textContent === "0" && e.target.textContent === "0") {
      return;
    }
    if (secondNumber === "0" && e.target.textContent === "0") {
      return;
    }
    if (
      firstNumber.length > 0 &&
      secondNumber === 0 &&
      e.target.textContent === "."
    ) {
      console.log("object :>> ");
      return;
    }

    if (e.target.textContent === ".") {
      dotCount = 1;
    }

    refs.display.textContent += number;
    if (firstNumber !== 0 && symbol !== null) {
      if (secondNumber === 0) {
        secondNumber = number;
      } else {
        secondNumber += number;
      }
    }
  }

  if (e.target.classList.contains("sym")) {
    if (refs.display.textContent !== "" || e.target.textContent === "-") {
      if (refs.display.textContent === " - ") {
        return;
      }
      if (symbol === null) {
        secondNumber = 0;
        firstNumber = refs.display.textContent.split(" ")[0];
        symbol = e.target.textContent;
        refs.display.textContent = `${firstNumber} ${symbol} `;
      } else {
        calculateTotal();
        secondNumber = 0;
        firstNumber = refs.display.textContent.split(" ")[0];
        symbol = e.target.textContent;
        refs.display.textContent = `${firstNumber} ${symbol} `;
      }
    }
    dotCount = 0;
  }
}

refs.equals.addEventListener("click", onEqualsClick);

function onEqualsClick(e) {
  calculateTotal();
}

function calculateTotal() {
  if (secondNumber === 0 || symbol === null) {
    return;
  }

  switch (symbol) {
    case "X":
      total = Number(firstNumber) * Number(secondNumber);
      break;
    case "/":
      total = Number(firstNumber) / Number(secondNumber);
      break;
    case "+":
      total = Number(firstNumber) + Number(secondNumber);
      break;
    case "-":
      total = Number(firstNumber) - Number(secondNumber);
      break;
  }

  if (String(total).includes(".")) {
    localStorageHistory.push(
      `${refs.display.textContent} = ${total.toFixed(2)}<br>`
    );
    localStorage.setItem("history", localStorageHistory);

    refs.display.textContent = total.toFixed(2);
  } else {
    localStorageHistory.push(`${refs.display.textContent} = ${total}<br>`);
    localStorage.setItem("history", localStorageHistory);

    refs.display.textContent = total;
  }

  upDateHistory();

  secondNumber = 0;
  firstNumber = 0;
  symbol = null;
}

refs.clearBtn.addEventListener("click", onClearBtnClick);

function onClearBtnClick(e) {
  e.target.classList.add("click");
  setTimeout(() => {
    e.target.classList.remove("click");
  }, 200);
  firstNumber = 0;
  secondNumber = 0;
  symbol = null;
  total = 0;
  refs.display.textContent = "";
  dotCount = 0;
}

refs.backBtn.addEventListener("click", onBackBtnClick);

function onBackBtnClick(e) {
  const element = e.currentTarget;
  const text = refs.display.textContent;

  element.classList.add("click");

  setTimeout(() => {
    element.classList.remove("click");
  }, 200);

  if (text.slice(-1) === " ") {
    refs.display.textContent = text.slice(0, -2);
  } else {
    refs.display.textContent = text.slice(0, -1);
  }

  if (text.slice(-1) === ".") {
    dotCount = 0;
  }

  secondNumber = String(secondNumber).slice(0, -1);

  if (!isNaN(Number(refs.display.textContent))) {
    symbol = null;
  }
}

refs.openHistoryBtn.addEventListener("click", onOpenHistoryBtnClick);

function onOpenHistoryBtnClick(e) {
  e.target.classList.toggle("active");
  refs.historyBlock.classList.toggle("active");
}

function upDateHistory() {
  if (localStorage.getItem("history") === null) {
    return;
  }

  refs.historyList.innerHTML = localStorage
    .getItem("history")
    .split(",")
    .join("");
}

refs.clearHistoryBtn.addEventListener("click", onClearHistoryBtnClick);

function onClearHistoryBtnClick(e) {
  localStorage.removeItem("history");
  localStorageHistory = [];
  refs.historyList.innerHTML = "";
}
