"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Zap, Shield, TrendingUp, Users, Award, Clock, Upload, X, LinkIcon, Sparkles, Target, Lock, FileText, Check, AlertCircle } from "lucide-react"
import { AnimatedTextCycle, GlassCard, FloatingElements } from "@/components/magic-ui"
import LoadingScreen from "@/components/loading-screen"
import ResultsScreen from "@/components/results-screen"
import ErrorDisplay from "@/components/ui/error-display"

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
  error_type?: 'error' | 'warning' | 'info'
}

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'info'>('error')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Ref para o input file
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Configuração da API - agora usando as API routes locais
  const API_BASE_URL = "/api"

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Formato não suportado. Use PNG ou JPG.")
      setErrorType('error')
      return false
    }

    if (file.size > maxSize) {
      setError("Arquivo muito grande. Máximo 5MB.")
      setErrorType('warning')
      return false
    }

    setError(null)
    setErrorType('error')
    return true
  }

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      // Aceita qualquer URL válida (imagem direta ou página web)
      setError(null)
      setErrorType('error')
      return true
    } catch {
      setError("URL inválida. Verifique o formato.")
      setErrorType('error')
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
      setErrorType('error')
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
    setErrorType('error')
  }

  // Função para analisar imagem via upload
  const analyzeUploadedImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        const error = new Error(errorData.error || 'Erro na análise')
        // Adiciona o tipo de erro ao objeto de erro
        ;(error as any).errorType = errorData.error_type || 'error'
        throw error
      }

      const result: AnalysisResult = await response.json()
      return result
    } catch (error) {
      console.error('Erro na análise:', error)
      throw error
    }
  }

  // Função para analisar imagem via URL
  const analyzeImageFromUrl = async (url: string) => {
    try {
      console.log('Enviando requisição para análise de URL:', url)
      const response = await fetch(`${API_BASE_URL}/analyze/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url
        }),
      })

      console.log('Resposta da API:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Erro na resposta da API:', response.status, errorData)
        const error = new Error(errorData.error || errorData.detail || `Erro na análise (${response.status})`)
        // Adiciona o tipo de erro ao objeto de erro
        ;(error as any).errorType = errorData.error_type || 'error'
        throw error
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
      setIsAnalyzing(true)

      try {
        let result: AnalysisResult

        if (selectedImage) {
          // Análise de arquivo enviado
          result = await analyzeUploadedImage(selectedImage)
        } else {
          // Análise de URL
          result = await analyzeImageFromUrl(imageUrl)
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
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido na análise'
        const errorTypeFromAPI = (error as any)?.errorType || 'error'
        setError(errorMessage)
        setErrorType(errorTypeFromAPI)
        setAppState("landing")
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  const handleNewAnalysis = () => {
    setAppState("landing")
    setSelectedImage(null)
    setImagePreview(null)
    setImageUrl("")
    setError(null)
    setErrorType('error')
    setAnalysisResult(null)
    setActiveTab('upload')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden dark">
      {/* Floating Background Elements */}
      <FloatingElements />

      {/* Header */}
      <header className="sticky top-0 bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Audito</h1>
            </div>
            <nav className="flex items-center">
              <Button 
                onClick={() => {
                  document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                size="sm" 
                className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 text-white font-medium"
              >
                Teste agora
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Análise com IA</span>
            </motion.div>

            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Analise seus{' '}
              <AnimatedTextCycle
                words={[
                  'produtos',
                  'designs',
                  'protótipos',
                  'conceitos',
                  'ideias',
                  'inovações'
                ]}
                interval={3000}
                className="bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent"
              />
              <br />
              com precisão de IA
            </h1>

            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Envie imagens, compartilhe URLs e obtenha insights instantâneos com IA, 
              análise competitiva e recomendações acionáveis.
            </p>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            id="upload-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard className="p-8">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-8 p-1 bg-muted/50 rounded-lg">
                {[
                  { id: 'upload', label: 'Enviar Arquivos', icon: Upload },
                  { id: 'url', label: 'Por URL', icon: LinkIcon }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === id
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* File Upload Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                        isDragOver
                          ? 'border-primary bg-primary/5 scale-105'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      
                      <motion.div
                        animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-white">
                            {isDragOver ? 'Solte os arquivos aqui' : 'Envie seus arquivos de produto'}
                          </h3>
                          <p className="text-gray-300">
                            Arraste e solte arquivos aqui, ou clique para navegar
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Suporta imagens até 5MB
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6"
                      >
                        <div className="relative">
                          <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-destructive/50 rounded-full shadow-sm border border-border z-10 hover:bg-destructive/70"
                          >
                            <X className="w-4 h-4 text-destructive-foreground" />
                          </button>
                          {imageUrl && !imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? (
                            <div className="w-full max-h-64 flex items-center justify-center rounded-lg border border-border bg-muted/50 p-8">
                              <div className="text-center">
                                <LinkIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                                <p className="text-sm font-medium text-foreground">Página web será capturada</p>
                                <p className="text-xs text-muted-foreground mt-1">{imageUrl}</p>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Visualização"
                              className="w-full max-h-64 object-contain rounded-lg border border-border"
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'url' && (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="url" className="block text-sm font-medium mb-2 text-white">
                          URL do Produto
                        </label>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="url"
                            type="url"
                            value={imageUrl}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://exemplo.com/produto"
                            className="pl-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                          Digite uma URL para analisar a página do produto, imagens e conteúdo
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>


              {/* Error Message */}
              {error && (
                <div className="mt-6">
                  <ErrorDisplay
                    error={error}
                    type={errorType}
                    onRetry={() => {
                      setError(null)
                      setErrorType('error')
                      if (imagePreview) {
                        handleAnalyze()
                      }
                    }}
                    onDismiss={() => {
                      setError(null)
                      setErrorType('error')
                    }}
                    showDetails={true}
                  />
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!imagePreview || isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 text-white font-semibold py-6 rounded-xl mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analisar Meu Produto
                  </>
                )}
              </Button>
            </GlassCard>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid md:grid-cols-3 gap-6 mt-16"
            >
              {[
                {
                  icon: Sparkles,
                  title: 'Insights com IA',
                  description: 'Obtenha análise detalhada usando inteligência artificial.'
                },
                {
                  icon: Check,
                  title: 'Resultados Instantâneos',
                  description: 'Receba insights em segundos, não horas'
                },
                {
                  icon: AlertCircle,
                  title: 'Recomendações Acionáveis',
                  description: 'Obtenha sugestões específicas para melhorar sua estratégia de produto'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                                  <GlassCard className="p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}