"use client"

import { useState, useEffect } from "react"
import { TokenManager, type TokenState } from "@/lib/token-system"

export function TokenDisplay() {
  const [tokenState, setTokenState] = useState<TokenState>({
    balance: 250,
    transactions: [],
    completedSteps: new Set(),
  })

  useEffect(() => {
    const tokenManager = TokenManager.getInstance()
    setTokenState(tokenManager.getState())

    const unsubscribe = tokenManager.subscribe((state) => {
      setTokenState(state)
    })

    return unsubscribe
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "linear-gradient(135deg, #ffd700, #ffed4e)",
        color: "#1a1a1a",
        padding: "12px 20px",
        borderRadius: "25px",
        fontSize: "16px",
        fontWeight: "bold",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
        border: "2px solid #ffd700",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minWidth: "120px",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: "18px" }}>🪙</span>
      <span>{tokenState.balance}</span>
    </div>
  )
}
