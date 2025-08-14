"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, ImageIcon, X, LinkIcon, Zap, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import LoadingScreen from "@/components/loading-screen"
import ResultsScreen from "@/components/results-screen"

type AppState = "upload" | "loading" | "results"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("upload")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [productContext, setProductContext] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Formato não suportado. Use PNG ou JPG.")
      return false
    }

    if (file.size > maxSize) {
      setError("Arquivo muito grande. Máximo 5MB.")
      return false
    }

    setError(null)
    return true
  }

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      if (!url.match(/\.(jpg|jpeg|png)$/i)) {
        setError("URL deve apontar para uma imagem PNG ou JPG.")
        return false
      }
      setError(null)
      return true
    } catch {
      setError("URL inválida. Verifique o formato.")
      return false
    }
  }

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedImage(file)
      setImageUrl("")
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (validateUrl(imageUrl)) {
      setSelectedImage(null)
      setImagePreview(imageUrl)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setImageUrl("")
    setError(null)
  }

  const handleAnalyze = () => {
    if ((selectedImage && imagePreview) || (imageUrl && imagePreview)) {
      setAppState("loading")

      setTimeout(() => {
        setAppState("results")
      }, 8000)
    }
  }

  const handleNewAnalysis = () => {
    setAppState("upload")
    setSelectedImage(null)
    setImagePreview(null)
    setImageUrl("")
    setProductContext("")
    setError(null)
  }

  if (appState === "loading" && imagePreview) {
    return <LoadingScreen imagePreview={imagePreview} imageName={selectedImage?.name || "Imagem da URL"} />
  }

  if (appState === "results" && imagePreview) {
    return (
      <ResultsScreen
        imagePreview={imagePreview}
        imageName={selectedImage?.name || "Imagem da URL"}
        score={72}
        issues={[]}
        onNewAnalysis={handleNewAnalysis}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Audito</h1>
          <p className="text-muted-foreground">Analise suas telas com inteligência artificial</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          {!imagePreview ? (
            <>
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                  ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">Arraste uma imagem ou cole uma URL</p>
                <p className="text-sm text-muted-foreground mb-4">PNG ou JPG até 5MB</p>

                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <label htmlFor="file-input">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("file-input")?.click()}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Selecionar Arquivo
                    </Button>
                  </label>

                  <div className="flex items-center gap-2">
                    <Input
                      type="url"
                      placeholder="ou cole URL da imagem"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-48"
                      size="sm"
                    />
                    <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()} size="sm">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <input
                  id="file-input"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-sm border border-border z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full max-h-64 object-contain rounded-lg border border-border"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{selectedImage?.name || "Imagem da URL"}</p>
                {selectedImage && (
                  <p className="text-xs text-muted-foreground">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <label htmlFor="product-context" className="text-sm font-medium text-foreground">
                Contexto do produto (opcional)
              </label>
            </div>
            <Textarea
              id="product-context"
              placeholder="Descreva seu produto: tipo de usuário, objetivo da tela, funcionalidades principais..."
              value={productContext}
              onChange={(e) => setProductContext(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{productContext.length}/500 caracteres</p>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={!imagePreview} className="w-full" size="lg">
            <Zap className="w-4 h-4 mr-2" />
            Analisar Tela
          </Button>
        </div>
      </div>
    </div>
  )
}
