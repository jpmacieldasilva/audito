"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, ImageIcon, X, LinkIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoadingScreen from "@/components/loading-screen"
import ResultsScreen from "@/components/results-screen"
import Link from "next/link"

type AppState = "upload" | "loading" | "results"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("upload")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")

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
      setUploadMethod("file")
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

      // Simular tempo de análise
      setTimeout(() => {
        setAppState("results")
      }, 8000) // 8 segundos para mostrar todas as mensagens
    }
  }

  const handleNewAnalysis = () => {
    setAppState("upload")
    setSelectedImage(null)
    setImagePreview(null)
    setImageUrl("")
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
              <Link href="/landing">
                <Button variant="ghost" size="sm">
                  Sobre o Produto
                </Button>
              </Link>
              <Link href="/landing#pricing">
                <Button variant="outline" size="sm">
                  Ver Planos
                </Button>
              </Link>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Assinar Agora
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Powered by AI
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
              Analise suas telas com
              <span className="text-primary"> inteligência artificial</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Seu companheiro de design para auditoria de telas. Detecte problemas de acessibilidade, usabilidade e
              design em segundos.
            </p>
          </div>

          {/* Upload Area */}
          <div className="space-y-8">
            {!imagePreview ? (
              <div className="space-y-6">
                <Tabs
                  value={uploadMethod}
                  onValueChange={(value) => setUploadMethod(value as "file" | "url")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="file" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload de Arquivo
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      URL da Imagem
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="file" className="mt-8">
                    <div
                      className={`
                        relative border-2 border-dashed rounded-xl p-12 md:p-16 text-center transition-all duration-200
                        ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                      `}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <div className="p-4 bg-primary/10 rounded-full">
                            <Upload className="w-8 h-8 text-primary" strokeWidth={1} />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xl font-serif font-semibold text-foreground">Arraste sua imagem aqui</h3>
                          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Ou clique no botão abaixo para selecionar um arquivo PNG ou JPG de até 5MB
                          </p>
                        </div>

                        <div className="pt-4">
                          <label htmlFor="file-input">
                            <Button
                              type="button"
                              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-full font-medium transition-colors duration-200"
                              onClick={() => document.getElementById("file-input")?.click()}
                            >
                              <ImageIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
                              Selecionar Imagem
                            </Button>
                          </label>
                          <input
                            id="file-input"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleFileInput}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="mt-8">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="space-y-3 text-center">
                        <div className="flex justify-center">
                          <div className="p-4 bg-primary/10 rounded-full">
                            <LinkIcon className="w-8 h-8 text-primary" strokeWidth={1} />
                          </div>
                        </div>
                        <h3 className="text-xl font-serif font-semibold text-foreground">Cole a URL da imagem</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Insira o link direto para uma imagem PNG ou JPG
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="https://exemplo.com/imagem.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleUrlSubmit}
                          disabled={!imageUrl.trim()}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Carregar
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              /* Image Preview */
              <div className="space-y-6">
                <div className="relative bg-card rounded-xl p-6 border border-border">
                  <button
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-2 bg-background rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 border border-border"
                  >
                    <X className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                  </button>

                  <div className="text-center">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview da imagem selecionada"
                      className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm"
                    />
                    <div className="mt-4 space-y-1">
                      <p className="font-medium text-foreground">{selectedImage?.name || "Imagem da URL"}</p>
                      {selectedImage && (
                        <p className="text-sm text-muted-foreground">
                          {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md mx-auto">
                <p className="text-destructive text-sm font-medium text-center">{error}</p>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <div className="text-center pt-8">
            <Button
              onClick={handleAnalyze}
              disabled={!imagePreview}
              size="lg"
              className={`
                px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200
                ${
                  imagePreview
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              <Zap className="w-5 h-5 mr-2" />
              Analisar Tela
            </Button>

            {!imagePreview && (
              <p className="text-sm text-muted-foreground mt-4">
                ✓ Análise gratuita • ✓ Resultados em segundos • ✓ Sem cadastro necessário
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
