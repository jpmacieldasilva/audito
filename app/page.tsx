"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingScreen from "@/components/loading-screen"
import ResultsScreen from "@/components/results-screen"

type AppState = "upload" | "loading" | "results"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("upload")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
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
    setError(null)
  }

  const handleAnalyze = () => {
    if (selectedImage && imagePreview) {
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
    setError(null)
  }

  if (appState === "loading" && selectedImage && imagePreview) {
    return <LoadingScreen imagePreview={imagePreview} imageName={selectedImage.name} />
  }

  if (appState === "results" && selectedImage && imagePreview) {
    return (
      <ResultsScreen
        imagePreview={imagePreview}
        imageName={selectedImage.name}
        score={72}
        issues={[]}
        onNewAnalysis={handleNewAnalysis}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-3 leading-tight">Audito</h1>
            <p className="text-base md:text-lg text-gray-600 font-medium">
              Seu companheiro de design para auditoria de telas
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-12">
          {/* Upload Area */}
          <div className="space-y-8">
            {!imagePreview ? (
              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-12 md:p-16 text-center transition-all duration-200
                  ${isDragOver ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"}
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <Upload className="w-8 h-8 text-gray-600" strokeWidth={1} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-black">Arraste sua imagem aqui</h3>
                    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                      Ou clique no botão abaixo para selecionar um arquivo PNG ou JPG de até 5MB
                    </p>
                  </div>

                  <div className="pt-4">
                    <label htmlFor="file-input">
                      <Button
                        type="button"
                        className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-full font-medium transition-colors duration-200"
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
            ) : (
              /* Image Preview */
              <div className="space-y-6">
                <div className="relative bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <button
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                  >
                    <X className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                  </button>

                  <div className="text-center">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview da imagem selecionada"
                      className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm"
                    />
                    <div className="mt-4 space-y-1">
                      <p className="font-medium text-black">{selectedImage?.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedImage && (selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <div className="text-center">
            <Button
              onClick={handleAnalyze}
              disabled={!selectedImage}
              className={`
                px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200
                ${
                  selectedImage
                    ? "bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Analisar Tela
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
