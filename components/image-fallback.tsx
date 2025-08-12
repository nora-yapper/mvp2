"use client"

import type React from "react"
import { useState } from "react"

interface ImageFallbackProps {
  src: string
  alt: string
  width: number
  height: number
  fallbackSrc?: string
  className?: string
  style?: React.CSSProperties
}

export function ImageFallback({
  src,
  alt,
  width,
  height,
  fallbackSrc = "/placeholder.svg",
  className,
  style,
}: ImageFallbackProps) {
  const [isError, setIsError] = useState(false)

  const handleError = () => {
    setIsError(true)
  }

  return (
    <img
      src={isError ? fallbackSrc : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        ...style,
        objectFit: "cover",
        display: "block",
      }}
      onError={handleError}
    />
  )
}
