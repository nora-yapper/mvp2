export interface TokenTransaction {
  id: string
  type: "earn" | "spend"
  amount: number
  reason: string
  timestamp: Date
}

export interface TokenState {
  balance: number
  transactions: TokenTransaction[]
  completedSteps: Set<string>
}

export const TOKEN_COSTS = {
  RESEARCH_ANALYSIS: 15,
  AI_CHAT_MESSAGE: 5,
  QUESTION_EVALUATION: 10,
  WHAT_IF_ANALYSIS: 20,
  IMPLEMENTATION_GENERATION: 25,
  MISSION_STEPS: 20,
} as const

export const TOKEN_REWARDS = {
  HOMEBASE_STARTUP_INFO: 30,
  RESEARCH_OVERVIEW_COMPLETE: 50,
  FIRST_QUESTION_EVALUATION: 25,
  MOM_TEST_GOOD_SCORE: 40,
  PRODUCT_ACTION_TABLE: 35,
  SALES_VALUE_PROPOSITION: 35,
  INTERVIEW_QUESTIONS_SAVED: 20,
} as const

export class TokenManager {
  private static instance: TokenManager
  private state: TokenState
  private listeners: ((state: TokenState) => void)[] = []

  private constructor() {
    this.state = this.loadState()
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  private loadState(): TokenState {
    if (typeof window === "undefined") {
      return {
        balance: 250,
        transactions: [],
        completedSteps: new Set(),
      }
    }

    const saved = localStorage.getItem("tokenState")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          balance: parsed.balance || 250,
          transactions: parsed.transactions || [],
          completedSteps: new Set(parsed.completedSteps || []),
        }
      } catch {
        // If parsing fails, return default state
      }
    }

    return {
      balance: 250,
      transactions: [],
      completedSteps: new Set(),
    }
  }

  private saveState(): void {
    if (typeof window !== "undefined") {
      const stateToSave = {
        balance: this.state.balance,
        transactions: this.state.transactions,
        completedSteps: Array.from(this.state.completedSteps),
      }
      localStorage.setItem("tokenState", JSON.stringify(stateToSave))
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state))
  }

  subscribe(listener: (state: TokenState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getState(): TokenState {
    return { ...this.state, completedSteps: new Set(this.state.completedSteps) }
  }

  canSpend(amount: number): boolean {
    return this.state.balance >= amount
  }

  spendTokens(amount: number, reason: string): boolean {
    if (!this.canSpend(amount)) {
      return false
    }

    const transaction: TokenTransaction = {
      id: Date.now().toString(),
      type: "spend",
      amount,
      reason,
      timestamp: new Date(),
    }

    this.state.balance -= amount
    this.state.transactions.push(transaction)
    this.saveState()
    this.notifyListeners()

    // Show notification
    this.showNotification(`-${amount} tokens`, reason, "spend")
    return true
  }

  earnTokens(amount: number, reason: string, stepId: string): boolean {
    // Check if step already completed
    if (this.state.completedSteps.has(stepId)) {
      return false
    }

    const transaction: TokenTransaction = {
      id: Date.now().toString(),
      type: "earn",
      amount,
      reason,
      timestamp: new Date(),
    }

    this.state.balance += amount
    this.state.transactions.push(transaction)
    this.state.completedSteps.add(stepId)
    this.saveState()
    this.notifyListeners()

    // Show notification
    this.showNotification(`+${amount} tokens`, reason, "earn")
    return true
  }

  private showNotification(change: string, reason: string, type: "earn" | "spend"): void {
    if (typeof window === "undefined") return

    // Create notification element
    const notification = document.createElement("div")
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${type === "earn" ? "#22c55e" : "#ef4444"};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">${type === "earn" ? "🪙" : "💸"}</span>
        <div>
          <div style="font-weight: bold;">${change}</div>
          <div style="font-size: 12px; opacity: 0.9;">${reason}</div>
        </div>
      </div>
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 2000)
  }

  reset(): void {
    this.state = {
      balance: 250,
      transactions: [],
      completedSteps: new Set(),
    }
    this.saveState()
    this.notifyListeners()
  }
}
