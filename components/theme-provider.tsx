"use client"

import type React from "react"

// Simple theme provider replacement without next-themes dependency
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
