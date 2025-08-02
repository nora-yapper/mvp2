"use client"

import type React from "react"

const Page: React.FC = () => {
  const navigationItems = [
    { label: "Home", onClick: () => {} },
    { label: "Dashboard", onClick: () => {} },
    { label: "Health Check", onClick: () => {} }, // Updated label from "Health Analysis" to "Health Check"
    { label: "Settings", onClick: () => {} },
  ]

  return (
    <div>
      <nav>
        <ul>
          {navigationItems.map((item, index) => (
            <li key={index} onClick={item.onClick}>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
      <main>{/* Main content goes here */}</main>
    </div>
  )
}

export default Page
