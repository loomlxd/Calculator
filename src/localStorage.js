import refs from "./refs";

export default class LocalStorageActions {
  constructor() {
    this.localStorageHistory = [];
    this.newHisElement = [];
  }

  updateLocalStorageHistory() {
    if (localStorage.getItem("history") === null) {
      return;
    }
    this.localStorageHistory = localStorage.getItem("history").split(",");
  }

  updateHistoryBlockNumber(total) {
    if (refs.display.textContent.length < 5) {
      this.newHisElement = [];
      return;
    }
    this.newHisElement = [`${refs.display.textContent} = ${total}`];
    this.localStorageHistory.push(`${refs.display.textContent} = ${total}`);
    localStorage.setItem("history", this.localStorageHistory);
  }

  clearHistory() {
    localStorage.removeItem("history");
    this.localStorageHistory = [];
  }
}
