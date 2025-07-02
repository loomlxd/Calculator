import refs from "./refs";

export default class LocalStorageActions {
  constructor() {
    this.localStorageHistory = [];
    this.newHisElement = [];
  }

  upDateHistory() {
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

  upDateLocalStorageHistory() {
    if (localStorage.getItem("history") === null) {
      return;
    }
    this.localStorageHistory = localStorage.getItem("history").split(",");
  }

  upDateHistoryBlockNotAWholeNumber(total) {
    this.newHisElement = [`${refs.display.textContent} = ${total.toFixed(2)}`];
    this.localStorageHistory.push(
      `${refs.display.textContent} = ${total.toFixed(2)}`
    );
    localStorage.setItem("history", this.localStorageHistory);
  }
  upDateHistoryBlockWholeNumber(total) {
    this.newHisElement = [`${refs.display.textContent} = ${total}`];
    this.localStorageHistory.push(`${refs.display.textContent} = ${total}`);
    localStorage.setItem("history", this.localStorageHistory);
  }

  clearHistory() {
    localStorage.removeItem("history");
    this.localStorageHistory = [];
    refs.historyList.innerHTML = "";
  }
}
