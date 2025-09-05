// Componente para seção de upload de arquivos
// Responsabilidade única: gerenciar upload de arquivos

"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useValidation } from "@/hooks/useValidation"

interface UploadSectionProps {
  selectedImage: File | null
  imagePreview: string | null
  isDragOver: boolean
  onFileSelect: (file: File) => void
  onRemoveImage: () => void
  onDragOver: (isOver: boolean) => void
  onDrop: (e: React.DragEvent) => void
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export default function UploadSection({
  selectedImage,
  imagePreview,
  isDragOver,
  onFileSelect,
  onRemoveImage,
  onDragOver,
  onDrop,
  onFileInputChange,
  fileInputRef
}: UploadSectionProps) {
  const { validateFile } = useValidation()

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file)
    if (validation.isValid) {
      onFileSelect(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          onDragOver(true)
        }}
        onDragLeave={() => onDragOver(false)}
        onDrop={onDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2"
              onClick={onRemoveImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Arraste uma imagem aqui
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ou clique para selecionar
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Selecionar Arquivo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileInputChange}
              className="hidden"
            />
          </div>
        )}
      </motion.div>

      {/* File Info */}
      {selectedImage && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedImage.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRemoveImage}
              >
                <X className="w-4 h-4 mr-2" />
                Remover
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
