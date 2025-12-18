"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImagePreviewProps {
  src: string
  alt: string
  onClose?: () => void
}

export function ImagePreview({ src, alt, onClose }: ImagePreviewProps) {
  return (
    <div className="relative group">
      <div className="relative h-48 w-full overflow-hidden rounded-lg border border-border bg-muted">
        <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-cover" />
      </div>
      {onClose && (
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
