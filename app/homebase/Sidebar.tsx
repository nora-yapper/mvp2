"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarItem {
  title: string
  url: string
  icon: string | React.ComponentType
  items: SidebarItem[]
}

interface SidebarProps {
  items: SidebarItem[]
}

export default function Sidebar({ items }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-5 left-5 z-50 w-12 h-12 bg-gray-800 border border-gray-600 text-gray-200",
          "hover:bg-gray-700 transition-colors duration-200",
          "clip-path-[polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]",
        )}
        style={{
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
        }}
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-40" />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-40 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 space-y-4">
          {/* Top section - Settings and Profile icons */}
          <div className="flex justify-end gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
              style={{
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              ⚙️
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
              style={{
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              👤
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-3">
            {[
              { label: "Map", href: "/main", active: false },
              { label: "Command Deck", href: "/homebase", active: true },
              { label: "Health Analysis", href: "/health-check", active: false },
              { label: "Forecast", href: "/forecast", active: false },
              { label: "Reports", href: "/reports", active: false },
              { label: "Network", href: "/network", active: false },
            ].map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left p-4 h-auto",
                  item.active
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600",
                )}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
                onClick={() => {
                  window.location.href = item.href
                  setIsOpen(false)
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
