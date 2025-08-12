"use client"

import type React from "react"

import { useState } from "react"

interface ImageFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}

export function ImageFallback({ src, alt, width, height, className, style, ...props }: ImageFallbackProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={className}
        style={{
          width: width || "100%",
          height: height || "auto",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: "14px",
          ...style,
        }}
      >
        Image not found
      </div>
    )
  }

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => setError(true)}
      {...props}
    />
  )
}
