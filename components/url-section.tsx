// Componente para seção de análise por URL
// Responsabilidade única: gerenciar análise por URL

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LinkIcon, X } from "lucide-react"
import { useValidation } from "@/hooks/useValidation"

interface UrlSectionProps {
  imageUrl: string
  imagePreview: string | null
  onUrlChange: (url: string) => void
  onUrlSubmit: () => void
  onRemoveImage: () => void
}

export default function UrlSection({
  imageUrl,
  imagePreview,
  onUrlChange,
  onUrlSubmit,
  onRemoveImage
}: UrlSectionProps) {
  const { validateUrl } = useValidation()
  const [isValid, setIsValid] = useState(true)

  const handleUrlChange = (url: string) => {
    onUrlChange(url)
    if (url.trim()) {
      const validation = validateUrl(url)
      setIsValid(validation.isValid)
    } else {
      setIsValid(true)
    }
  }

  const handleSubmit = () => {
    if (imageUrl.trim()) {
      const validation = validateUrl(imageUrl)
      if (validation.isValid) {
        onUrlSubmit()
      } else {
        setIsValid(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="space-y-4">
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="url"
            placeholder="Cole a URL da imagem ou página web aqui..."
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`pl-10 ${!isValid ? 'border-red-500' : ''}`}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        
        {!isValid && (
          <p className="text-sm text-red-500">
            URL inválida. Verifique o formato e tente novamente.
          </p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!imageUrl.trim() || !isValid}
          className="w-full"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Analisar URL
        </Button>
      </div>

      {/* Preview Area */}
      {imagePreview && (
        <Card>
          <CardContent className="p-4">
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
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {imageUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
                  ? "Imagem carregada"
                  : "Página web será capturada"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
