import "./style.css";
import refs from "./refs";
import "./reset.css";
import LocalStorageActions from "./localStorage";

const localSto = new LocalStorageActions();

const state = {
  firstNumber: "",
  secondNumber: "",
  symbol: null,
  total: 0,
  dotCount: 0,
};

localSto.updateLocalStorageHistory();

updateHistory();

refs.keyPads.addEventListener("click", onKeyPadsClick);

function onKeyPadsClick(e) {
  if (e.target.tagName !== "BUTTON") {
    return;
  }

  if (e.target.classList.contains("number")) {
    const number = e.target.textContent;

    if (state.symbol === "/" && e.target.textContent === "0") {
      return;
    }
    if (
      (refs.display.textContent === "" && e.target.textContent === ".") ||
      (refs.display.textContent === " - " && e.target.textContent === ".")
    ) {
      return;
    }
    if (state.dotCount === 1 && e.target.textContent === ".") {
      return;
    }
    if (refs.display.textContent === "0" && e.target.textContent === "0") {
      return;
    }
    if (state.secondNumber === "0" && e.target.textContent === "0") {
      return;
    }
    if (
      state.firstNumber.length > 0 &&
      state.secondNumber === "" &&
      e.target.textContent === "."
    ) {
      return;
    }

    if (e.target.textContent === ".") {
      state.dotCount = 1;
    }

    refs.display.textContent += number;
    if (state.firstNumber !== 0 && state.symbol !== null) {
      if (!state.secondNumber) {
        state.secondNumber = number;
      } else {
        state.secondNumber += number;
      }
    }
  }

  if (e.target.classList.contains("sym")) {
    if (refs.display.textContent !== "" || e.target.textContent === "-") {
      if (refs.display.textContent === " - ") {
        return;
      }
      if (state.symbol === null) {
        state.secondNumber = "";
        state.firstNumber = refs.display.textContent.split(" ")[0];
        state.symbol = e.target.textContent;
        refs.display.textContent = `${state.firstNumber} ${state.symbol} `;
      } else {
        calculateTotal();
        state.secondNumber = "";
        state.firstNumber = refs.display.textContent.split(" ")[0];
        state.symbol = e.target.textContent;
        refs.display.textContent = `${state.firstNumber} ${state.symbol} `;
      }
    }
    state.dotCount = 0;
  }
}

refs.equals.addEventListener("click", onEqualsClick);

function onEqualsClick(e) {
  calculateTotal();
}

function calculateTotal() {
  if (!state.secondNumber || !state.symbol) {
    return;
  }

  switch (state.symbol) {
    case "X":
      state.total = Number(state.firstNumber) * Number(state.secondNumber);
      break;
    case "/":
      state.total = Number(state.firstNumber) / Number(state.secondNumber);
      break;
    case "+":
      state.total = Number(state.firstNumber) + Number(state.secondNumber);
      break;
    case "-":
      state.total = Number(state.firstNumber) - Number(state.secondNumber);
      break;
  }

  if (String(state.total).includes(".")) {
    localSto.updateHistoryBlockNumber(state.total.toFixed(2));
    refs.display.textContent = state.total.toFixed(2);
  } else {
    localSto.updateHistoryBlockNumber(state.total);
    refs.display.textContent = state.total;
  }

  localSto.newHisElement.map((el) => {
    const entry = document.createElement("div");
    entry.textContent = `${el}`;
    refs.historyList.appendChild(entry);
  });

  state.secondNumber = "";
  state.firstNumber = "";
  state.symbol = null;
}

refs.clearBtn.addEventListener("click", onClearBtnClick);

function onClearBtnClick(e) {
  e.target.classList.add("click");
  setTimeout(() => {
    e.target.classList.remove("click");
  }, 200);
  state.firstNumber = "";
  state.secondNumber = "";
  state.symbol = null;
  state.total = 0;
  refs.display.textContent = "";
  state.dotCount = 0;
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
    state.dotCount = 0;
  }

  state.secondNumber = String(state.secondNumber).slice(0, -1);

  if (!isNaN(Number(refs.display.textContent))) {
    state.symbol = null;
  }
}

refs.openHistoryBtn.addEventListener("click", onOpenHistoryBtnClick);

function onOpenHistoryBtnClick(e) {
  e.target.classList.toggle("active");
  refs.historyBlock.classList.toggle("active");
}

refs.clearHistoryBtn.addEventListener("click", clearHistory);

function clearHistory() {
  localSto.clearHistory();
  refs.historyList.textContent = "";
}

function updateHistory() {
  if (localStorage.getItem("history") === null) {
    return;
  }

  localStorage
    .getItem("history")
    .split(",")
    .map((el) => {
      const entry = document.createElement("div");
      entry.textContent = `${el}`;
      refs.historyList.appendChild(entry);
    });
}
