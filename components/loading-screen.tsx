"use client"

import React, { useState, useEffect } from "react"
import { Loader2, CheckCircle2, Sparkles, Zap, Shield, ArrowRight } from "lucide-react"
import { Progress } from "./ui/progress"

interface LoadingScreenProps {
  imagePreview: string
  imageName: string
}

// Analysis steps with icons
const analysisSteps = [
  { name: "Analisando elementos visuais", icon: Sparkles },
  { name: "Verificando usabilidade e acessibilidade", icon: Shield },
  { name: "Gerando recomendações personalizadas", icon: Zap }
]

export default function LoadingScreen({ imagePreview, imageName }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepDuration = 4000 // 4 seconds per step
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
    <div className="min-h-screen bg-gradient-to-br from-background/80 via-background to-background/90 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background animated gradient effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0 bg-[conic-gradient(from_0deg,theme(colors.blue.800),theme(colors.slate.600),theme(colors.gray.600),theme(colors.blue.800))] animate-[spin_8s_linear_infinite] blur-3xl"
        />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header with animated icon */}
        <div className="text-center space-y-5">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-slate-600 rounded-full opacity-20 animate-pulse" />
            <div className="absolute inset-2 bg-gradient-to-r from-blue-900 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Analisando Interface</h1>
          <p className="text-muted-foreground">Nossa IA está examinando sua interface em busca de insights</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Progresso da Análise</span>
            <span className="font-bold text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>

        {/* Current Step Card with Glow Effect */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border shadow-sm relative overflow-hidden group">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/10 to-slate-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-800 to-slate-600 rounded-full flex items-center justify-center shadow-md">
              {React.createElement(analysisSteps[currentStep].icon, { className: "w-6 h-6 text-white" })}
            </div>
            <div>
              <p className="font-semibold text-foreground">{analysisSteps[currentStep].name}</p>
              <p className="text-sm text-muted-foreground">Passo {currentStep + 1} de {analysisSteps.length}</p>
            </div>
          </div>
        </div>

        {/* Steps List with Improved Visuals */}
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-5 border border-border shadow-sm space-y-4">
          <h3 className="font-semibold text-foreground text-sm">Processo de Análise</h3>
          
          <div className="space-y-3">
            {analysisSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  index < currentStep ? 'bg-green-500 text-white' : 
                  index === currentStep ? 'bg-blue-500 text-white' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : index === currentStep ? (
                    React.createElement(step.icon, { className: "w-4 h-4" })
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    index < currentStep ? 'text-green-600 dark:text-green-400' : 
                    index === currentStep ? 'text-blue-600 dark:text-blue-400' : 
                    'text-muted-foreground'
                  }`}>
                    {step.name}
                  </span>
                  
                  {/* Progress line for current step */}
                  {index === currentStep && (
                    <div className="h-1 bg-muted rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ 
                          width: `${(progress - (currentStep * (100/analysisSteps.length))) * (analysisSteps.length)}%`,
                          maxWidth: '100%'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Estimate with Improved Design */}
        <div className="bg-card/20 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Tempo estimado restante:
          </p>
          <span className="text-sm font-bold text-foreground bg-background/50 px-3 py-1 rounded-full">
            15-30 segundos
          </span>
        </div>
        
        {/* Preview Badge */}
        {imagePreview && (
          <div className="absolute -top-2 -right-2 bg-card rounded-lg p-2 border border-border shadow-md">
            <div className="relative w-16 h-16 rounded-md overflow-hidden">
              <img 
                src={imagePreview} 
                alt={imageName} 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}