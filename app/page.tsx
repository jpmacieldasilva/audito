"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Shield, TrendingUp, Users, Award, Clock, Upload, X, LinkIcon } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"
import ResultsScreen from "@/components/results-screen"

type AppState = "landing" | "loading" | "results"

// Tipos para a API
interface Recommendation {
  id: string
  title: string
  problem: string
  impact: string
  suggestion: string
  category: string
}

interface AnalysisResult {
  success: boolean
  overall_assessment: string
  user_context: string
  recommendations: Recommendation[]
  image_info?: any
  source_url?: string
  screenshot_data?: string
  analysis_timestamp?: number
  error?: string
}

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [productContext, setProductContext] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  
  // Ref para o input file
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Configuração da API
  const API_BASE_URL = typeof window !== 'undefined' && (window as any).ENV?.API_URL ? (window as any).ENV.API_URL : "https://backend-5bhc5e1r1-joao-paulo-s-projects.vercel.app"

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
      // Aceita qualquer URL válida (imagem direta ou página web)
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
      // Para URLs de imagem direta, mostrar preview. Para páginas web, usar placeholder
      if (imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
        setImagePreview(imageUrl)
      } else {
        // Para páginas web, usar um placeholder
        setImagePreview("/placeholder.svg")
      }
    }
  }

  // Função para validar URL automaticamente ao digitar
  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    if (url.trim()) {
      if (validateUrl(url)) {
        setSelectedImage(null)
        // Para URLs de imagem direta, mostrar preview. Para páginas web, usar placeholder
        if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
          setImagePreview(url)
        } else {
          // Para páginas web, usar um placeholder
          setImagePreview("/placeholder.svg")
        }
      } else {
        setImagePreview(null)
      }
    } else {
      setImagePreview(null)
      setError(null)
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

  // Função para analisar imagem via upload
  const analyzeUploadedImage = async (file: File, context: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (context) {
      formData.append('product_context', context)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro na análise')
      }

      const result: AnalysisResult = await response.json()
      return result
    } catch (error) {
      console.error('Erro na análise:', error)
      throw error
    }
  }

  // Função para analisar imagem via URL
  const analyzeImageFromUrl = async (url: string, context: string) => {
    try {
      console.log('Enviando requisição para análise de URL:', url)
      const response = await fetch(`${API_BASE_URL}/api/analyze/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          product_context: context
        }),
      })

      console.log('Resposta da API:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Erro na resposta da API:', response.status, errorData)
        throw new Error(errorData.error || errorData.detail || `Erro na análise (${response.status})`)
      }

      const result: AnalysisResult = await response.json()
      console.log('Análise concluída com sucesso')
      return result
    } catch (error) {
      console.error('Erro na análise:', error)
      throw error
    }
  }

  const handleAnalyze = async () => {
    if ((selectedImage && imagePreview) || (imageUrl && imagePreview)) {
      setAppState("loading")
      setError(null)

      try {
        let result: AnalysisResult

        if (selectedImage) {
          // Análise de arquivo enviado
          result = await analyzeUploadedImage(selectedImage, productContext)
        } else {
          // Análise de URL
          result = await analyzeImageFromUrl(imageUrl, productContext)
        }

        if (result.success) {
          console.log('Debug - Resposta da API:', result)
          setAnalysisResult(result)
          setAppState("results")
        } else {
          throw new Error(result.error || 'Análise falhou')
        }
      } catch (error) {
        console.error('Erro na análise:', error)
        setError(error instanceof Error ? error.message : 'Erro desconhecido na análise')
        setAppState("landing")
      }
    }
  }

  const handleNewAnalysis = () => {
    setAppState("landing")
    setSelectedImage(null)
    setImagePreview(null)
    setImageUrl("")
    setProductContext("")
    setError(null)
    setAnalysisResult(null)
  }

  if (appState === "loading" && imagePreview) {
    const loadingName = selectedImage?.name || 
      (imageUrl && !imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? "Capturando página..." : "Imagem da URL")
    return <LoadingScreen imagePreview={imagePreview} imageName={loadingName} />
  }

  if (appState === "results" && imagePreview && analysisResult) {
    // Para URLs de página web, usar screenshot_data se disponível, senão usar placeholder
    // Para imagens diretas, usar sempre o imagePreview original
    let displayImage = imagePreview
    
    if (imageUrl && !imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
      // É uma URL de página web, tentar usar screenshot
      if (analysisResult.screenshot_data && analysisResult.screenshot_data.startsWith('data:image')) {
        displayImage = analysisResult.screenshot_data
      } else if (analysisResult.screenshot_data && analysisResult.screenshot_data.startsWith('http')) {
        displayImage = analysisResult.screenshot_data
      } else {
        // Se não temos screenshot válido, usar placeholder
        displayImage = "/placeholder.svg"
      }
    }
    
    console.log('Debug - Imagem para exibição:', {
      originalPreview: imagePreview,
      screenshotData: analysisResult.screenshot_data,
      displayImage: displayImage,
      isWebPage: imageUrl && !imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i),
      screenshotType: analysisResult.screenshot_data ? typeof analysisResult.screenshot_data : 'undefined'
    })
    
    return (
      <ResultsScreen
        imagePreview={displayImage}
        imageName={selectedImage?.name || 
          (imageUrl && !imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? "Screenshot da página" : "Imagem da URL")}
        userContext={analysisResult.user_context}
        issues={analysisResult.recommendations}
        onNewAnalysis={handleNewAnalysis}
      />
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col">
     

      {/* Hero Section with Integrated Upload */}
      <section className="flex-1 flex items-center justify-center bg-grid-pattern">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-serif font-bold text-foreground">Audito</h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              Transforme seu produto
              <br />
              <span className="text-primary italic">em experiências perfeitas</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Insights precisos para melhorar a usabilidade do seu produto
            </p>
          </div>

          {/* Integrated Upload Area */}
          <div className="bg-card rounded-xl border border-border p-8 space-y-6 max-w-2xl mx-auto">
            {!imagePreview ? (
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button
                  type="button"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 px-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload de imagem
                </Button>

                <div className="flex items-center gap-2">
                  <Input
                    type="url"
                    placeholder="ou cole uma URL"
                    value={imageUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-48 border-dashed"
                  />
                  <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()} size="lg" variant="outline">
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
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
                  {imageUrl && !imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? (
                    <div className="w-full max-h-64 flex items-center justify-center rounded-lg border border-border bg-muted p-8">
                      <div className="text-center">
                        <LinkIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm font-medium">Página web será capturada</p>
                        <p className="text-xs text-muted-foreground mt-1">{imageUrl}</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-lg border border-border"
                    />
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Textarea
                placeholder="Descreva seu produto (opcional)"
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
              Analise meu produto
            </Button>

            
          </div>
        </div>
      </section>

      {/* Features Section */}
      
    </div>
  )
}
