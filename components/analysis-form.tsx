// Componente para formulário de análise
// Responsabilidade única: gerenciar formulário e contexto do produto

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Sparkles } from "lucide-react"

interface AnalysisFormProps {
  productContext: string
  onContextChange: (context: string) => void
  onAnalyze: () => void
  isAnalyzing: boolean
  hasImage: boolean
}

export default function AnalysisForm({
  productContext,
  onContextChange,
  onAnalyze,
  isAnalyzing,
  hasImage
}: AnalysisFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Product Context */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contexto do Produto (Opcional)
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Forneça informações sobre o produto ou contexto para uma análise mais precisa
            </p>
            <Textarea
              placeholder="Ex: Aplicativo de e-commerce para venda de roupas, focado em usuários jovens..."
              value={productContext}
              onChange={(e) => onContextChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Analyze Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={onAnalyze}
          disabled={!hasImage || isAnalyzing}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Analisar Interface
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}
