"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Shield, TrendingUp, Users, Award, Clock, Upload, X, LinkIcon } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"
import ResultsScreen from "@/components/results-screen"

type AppState = "landing" | "loading" | "results"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("landing")
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
    setAppState("landing")
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-serif font-bold text-foreground">Audito</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              
              
              {/* <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a> */}
              
              
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Integrated Upload */}
      <section className="py-20 md:py-32 bg-grid-pattern">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              Transforme seu produto
              <br />
              <span className="text-primary italic">em experiências perfeitas</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Insights preciso para melhorar a usabilidade do seu produto
            </p>
          </div>

          {/* Integrated Upload Area */}
          <div className="bg-card rounded-xl border border-border p-8 space-y-6 max-w-2xl mx-auto">
            {!imagePreview ? (
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <label htmlFor="file-input">
                  <Button
                    type="button"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 px-8"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload a image
                  </Button>
                </label>

                <div className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="or paste a url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-48 border-dashed"
                    size="lg"
                  />
                  <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()} size="lg" variant="outline">
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>

                <input
                  id="file-input"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
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
              </div>
            )}

            <div className="space-y-3">
              <Textarea
                placeholder="Describe your product (opcional)"
                value={productContext}
                onChange={(e) => setProductContext(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={500}
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm text-center">{error}</p>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!imagePreview}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Analyze my product
            </Button>

            
          </div>
        </div>
      </section>

      {/* Features Section */}
      

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Audito. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
