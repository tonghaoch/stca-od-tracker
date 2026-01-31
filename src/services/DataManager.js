import { LOCAL_STORAGE_KEY, DEFAULT_MODE, MODE_LIMITS } from "../utils/constants"

export default class DataManager {
  constructor(mode = DEFAULT_MODE) {
    this.mode = mode
    const persisted = this.getItemsFromLocalStorage()
    this.data = new Map(this.deserialize(persisted))
  }

  setMode(mode) {
    this.mode = mode
  }

  getLimit() {
    return MODE_LIMITS[this.mode]
  }

  isUserLogged(cardId) {
    const count = this.data.get(cardId) || 0
    return count >= this.getLimit()
  }

  logUser(cardId) {
    if (!cardId) {
      return false
    }

    const currentCount = this.data.get(cardId) || 0
    if (currentCount >= this.getLimit()) {
      return false
    }

    this.data.set(cardId, currentCount + 1)
    this.addToLocalStorage()
    return true
  }

  getData() {
    return this.data
  }

  getTotalLogs() {
    return this.data.size
  }

  emptyData() {
    this.removeFromLocalStorage()
    this.data.clear()
  }

  addToLocalStorage() {
    const serialized = Array.from(this.data.entries())
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serialized))
  }

  getItemsFromLocalStorage() {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!storedValue) {
      return []
    }

    try {
      return JSON.parse(storedValue)
    } catch (error) {
      console.warn("Failed to parse stored value", error)
      return []
    }
  }

  deserialize(stored) {
    if (!stored) {
      return []
    }

    if (Array.isArray(stored)) {
      return stored.map((entry) => {
        if (Array.isArray(entry)) {
          const [cardId, count] = entry
          return [cardId, this.toCount(count)]
        }
        return [entry, 1]
      })
    }

    if (typeof stored === "object") {
      return Object.entries(stored).map(([cardId, count]) => [
        cardId,
        this.toCount(count),
      ])
    }

    return []
  }

  toCount(value) {
    const numeric = Number(value)
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 1
  }

  removeFromLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
}
