"use client"

import React from "react"

interface ImageFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  style?: React.CSSProperties
}

export function ImageFallback({
  src,
  alt,
  width,
  height,
  className = "",
  priority,
  fill,
  sizes,
  quality,
  placeholder,
  blurDataURL,
  onLoad,
  onError,
  style,
  ...props
}: ImageFallbackProps) {
  const [error, setError] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    onError?.()
  }

  const imgStyle: React.CSSProperties = {
    ...style,
    ...(fill ? { position: "absolute", inset: 0, objectFit: "cover" } : {}),
    ...(width && !fill ? { width } : {}),
    ...(height && !fill ? { height } : {}),
  }

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={imgStyle}>
        <span className="text-gray-500 text-sm">Image not found</span>
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
      style={imgStyle}
      onLoad={handleLoad}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  )
}
