"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  imagePreview: string
  imageName: string
}

const loadingMessages = [
  "Verificando contraste e acessibilidade...",
  "Checando espaçamentos e alinhamentos...",
  "Lendo textos e analisando clareza...",
  "Avaliando hierarquia visual...",
  "Analisando usabilidade geral...",
]

export default function LoadingScreen({ imagePreview, imageName }: LoadingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header consistente com outras telas */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-serif font-bold text-foreground">Audito</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              {/* Navegação vazia para manter consistência */}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Coluna principal com preview da imagem */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              {/* Browser Header mockup */}
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-white/70 text-sm">{imageName}</div>
                </div>
              </div>

              {/* Image preview area */}
              <div className="p-0 bg-white min-h-[700px] flex items-center justify-center relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt={`Analisando ${imageName}`}
                  className="max-w-full max-h-full object-contain"
                />
                
                {/* Loading overlay */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="p-6 bg-white rounded-full shadow-lg border border-gray-200">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-gray-900">Analisando interface...</h2>
                      <div className="min-h-[24px] flex items-center justify-center">
                        <p
                          key={currentMessageIndex}
                          className="text-sm text-gray-600 animate-fade-in max-w-md mx-auto"
                        >
                          {loadingMessages[currentMessageIndex]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar com informações de loading */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Status Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">Status da Análise</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(((currentMessageIndex + 1) / loadingMessages.length) * 100)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${((currentMessageIndex + 1) / loadingMessages.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Nossa IA está examinando cada elemento da sua interface para fornecer insights detalhados sobre usabilidade e acessibilidade.
                  </p>
                </div>
              </div>
            </div>

            {/* What we're analyzing */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 text-sm">O que estamos analisando:</h4>
                
                <div className="space-y-2">
                  {[
                    "Hierarquia visual",
                    "Contraste e legibilidade", 
                    "Navegação e usabilidade",
                    "Acessibilidade",
                    "Padrões de design"
                  ].map((item, index) => (
                    <div key={item} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index <= currentMessageIndex ? 'bg-primary' : 'bg-gray-300'
                      } transition-colors duration-500`} />
                      <span className={`text-xs ${
                        index <= currentMessageIndex ? 'text-gray-900' : 'text-gray-500'
                      } transition-colors duration-500`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expected time */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900 text-sm">Tempo estimado</h4>
                <p className="text-xs text-blue-700">
                  A análise geralmente leva entre 15-30 segundos para ser concluída.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
