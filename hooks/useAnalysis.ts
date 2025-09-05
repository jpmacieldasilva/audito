// Hook personalizado para gerenciar estado da análise
// Centraliza lógica de análise e estado

import { useState, useCallback } from "react"
import performanceMonitor from "@/lib/performance"

interface AnalysisResult {
  success: boolean
  overall_assessment: string
  user_context: string
  recommendations: any[]
  image_info?: any
  source_url?: string
  screenshot_data?: string
  analysis_timestamp?: number
  error?: string
  error_type?: 'error' | 'warning' | 'info'
  from_cache?: boolean
  cache_timestamp?: number
}

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'info'>('error')

  // Função para analisar imagem via upload
  const analyzeUploadedImage = useCallback(async (file: File, productContext: string = "") => {
    return performanceMonitor.measureTimeAsync('upload_analysis', async () => {
      const formData = new FormData()
      formData.append('file', file)
      if (productContext) {
        formData.append('productContext', productContext)
      }

      try {
        const response = await fetch('/api/analyze/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          const error = new Error(errorData.error || 'Erro na análise')
          ;(error as any).errorType = errorData.error_type || 'error'
          throw error
        }

        const result: AnalysisResult = await response.json()
        
        // Registra métricas de cache
        if (result.from_cache) {
          performanceMonitor.recordMetric('cache_hit', 1, 'counter', { type: 'upload' });
        } else {
          performanceMonitor.recordMetric('cache_miss', 1, 'counter', { type: 'upload' });
        }

        return result
      } catch (error) {
        console.error('Erro na análise:', error)
        performanceMonitor.recordMetric('api_error', 1, 'counter', { type: 'upload', error: 'true' });
        throw error
      }
    });
  }, [])

  // Função para analisar imagem via URL
  const analyzeImageFromUrl = useCallback(async (url: string, productContext: string = "") => {
    return performanceMonitor.measureTimeAsync('url_analysis', async () => {
      try {
        const response = await fetch('/api/analyze/url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            productContext: productContext
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const error = new Error(errorData.error || errorData.detail || `Erro na análise (${response.status})`)
          ;(error as any).errorType = errorData.error_type || 'error'
          throw error
        }

        const result: AnalysisResult = await response.json()
        
        // Registra métricas de cache
        if (result.from_cache) {
          performanceMonitor.recordMetric('cache_hit', 1, 'counter', { type: 'url' });
        } else {
          performanceMonitor.recordMetric('cache_miss', 1, 'counter', { type: 'url' });
        }
        
        return result
      } catch (error) {
        console.error('Erro na análise:', error)
        performanceMonitor.recordMetric('api_error', 1, 'counter', { type: 'url', error: 'true' });
        throw error
      }
    });
  }, [])

  // Função para executar análise
  const performAnalysis = useCallback(async (
    selectedImage: File | null,
    imageUrl: string,
    productContext: string
  ) => {
    setIsAnalyzing(true)
    setError(null)
    setErrorType('error')

    try {
      let result: AnalysisResult

      if (selectedImage) {
        result = await analyzeUploadedImage(selectedImage, productContext)
      } else if (imageUrl) {
        result = await analyzeImageFromUrl(imageUrl, productContext)
      } else {
        throw new Error('Nenhuma imagem selecionada')
      }

      setAnalysisResult(result)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      const errorTypeFromAPI = (error as any)?.errorType || 'error'
      
      setError(errorMessage)
      setErrorType(errorTypeFromAPI)
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }, [analyzeUploadedImage, analyzeImageFromUrl])

  // Função para limpar análise
  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null)
    setError(null)
    setErrorType('error')
  }, [])

  return {
    isAnalyzing,
    analysisResult,
    error,
    errorType,
    performAnalysis,
    clearAnalysis,
    setError,
    setErrorType
  }
}
