"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"

interface LoadingScreenProps {
  imagePreview: string
  imageName: string
}

// Etapas simplificadas do processo de análise
const analysisSteps = [
  "Capturando screenshot da página",
  "Analisando elementos visuais",
  "Verificando usabilidade e acessibilidade",
  "Gerando recomendações personalizadas"
]

export default function LoadingScreen({ imagePreview, imageName }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepDuration = 4000 // 4 segundos por etapa
    const totalDuration = stepDuration * analysisSteps.length
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (totalDuration / 100))
        if (newProgress >= 100) {
          return 100
        }
        return newProgress
      })
    }, 100)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, stepDuration)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Analisando Interface</h1>
          <p className="text-gray-600">Aguarde enquanto nossa IA examina sua interface</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{currentStep + 1}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{analysisSteps[currentStep]}</p>
              <p className="text-sm text-gray-500">Etapa {currentStep + 1} de {analysisSteps.length}</p>
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
          <h3 className="font-medium text-gray-900 text-sm">Etapas da Análise</h3>
          {analysisSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                index < currentStep ? 'bg-green-500' : 
                index === currentStep ? 'bg-primary' : 
                'bg-gray-300'
              }`}>
                {index < currentStep ? (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                ) : (
                  <span className="text-white text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span className={`text-sm ${
                index < currentStep ? 'text-green-700' : 
                index === currentStep ? 'text-primary' : 
                'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Time Estimate */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Tempo estimado: <span className="font-medium">15-30 segundos</span>
          </p>
        </div>

      </div>
    </div>
  )
}
