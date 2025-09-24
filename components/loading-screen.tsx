"use client"

import React from "react"
import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  imagePreview: string
  imageName: string
}

export default function LoadingScreen({ imagePreview, imageName }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-8 text-center">
        {/* Simple loading icon */}
        <div className="flex justify-center">
          <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
        </div>

        {/* Simple text */}
        <div className="space-y-2">
          <h1 className="text-xl font-medium text-foreground">Analisando</h1>
          <p className="text-sm text-muted-foreground">Processando sua interface...</p>
        </div>

        {/* Image preview */}
        <div className="relative">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
            <img 
              src={imagePreview} 
              alt={imageName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}