"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Paperclip, X, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onFileSelect(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const removeFile = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" id="file-upload" />

      {selectedFile ? (
        <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
          <FileIcon className="h-4 w-4 text-muted-foreground" />
          <span className="max-w-[120px] truncate">{selectedFile.name}</span>
          <Button size="icon" variant="ghost" className="h-5 w-5" onClick={removeFile}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          className={cn("h-9 w-9 transition-colors", dragActive && "bg-primary/10")}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
