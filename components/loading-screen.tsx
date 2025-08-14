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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-3 leading-tight">Audito</h1>
            <p className="text-base md:text-lg text-gray-600 font-medium">Companion Design Auditor</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-12 text-center">
          {/* Image Preview */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 max-w-2xl mx-auto">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt={`Analisando ${imageName}`}
              className="max-w-full max-h-80 mx-auto rounded-lg shadow-sm"
            />
            <div className="mt-4">
              <p className="font-medium text-black">{imageName}</p>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="p-6 bg-gray-50 rounded-full">
                <Loader2 className="w-12 h-12 text-black animate-spin" strokeWidth={1} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-black">Analisando sua tela...</h2>

              <div className="min-h-[60px] flex items-center justify-center">
                <p
                  key={currentMessageIndex}
                  className="text-lg text-gray-600 font-medium animate-fade-in max-w-md mx-auto"
                >
                  {loadingMessages[currentMessageIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-black h-1 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${((currentMessageIndex + 1) / loadingMessages.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
