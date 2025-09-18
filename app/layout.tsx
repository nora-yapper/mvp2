import type React from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 20, fontFamily: "Arial, sans-serif" }}>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
