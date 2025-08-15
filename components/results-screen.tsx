"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Issue {
  id: string
  title: string
  description: string
  impact: "Alto" | "Médio" | "Baixo"
  suggestion: string
}

interface ResultsScreenProps {
  imagePreview: string
  imageName: string
  score: number
  issues: Issue[]
  onNewAnalysis: () => void
}

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Problema",
    description: 'O botão "Finalizar ordem" é a ação mais proeminente na tela (botão primário).',
    impact: "Alto",
    suggestion:
      'Reavaliar a Hierarquia do Botão: Considere tornar "Finalizar ordem" um botão secundário (ex: com contorno, sem preenchimento sólido) para reduzir sua proeminência. Adicionar Confirmação: Ao clicar em "Finalizar ordem", exiba um modal de confirmação ("Você tem certeza que deseja finalizar a Ordem 00000000? Esta ação não pode ser desfeita.") para prevenir erros.',
  },
  {
    id: "2",
    title: "Problema",
    description: 'O botão "Finalizar ordem" é a ação mais proeminente na tela (botão primário).',
    impact: "Médio",
    suggestion:
      'Reavaliar a Hierarquia do Botão: Considere tornar "Finalizar ordem" um botão secundário (ex: com contorno, sem preenchimento sólido) para reduzir sua proeminência.',
  },
  {
    id: "3",
    title: "Problema",
    description: 'O botão "Finalizar ordem" é a ação mais proeminente na tela (botão primário).',
    impact: "Baixo",
    suggestion:
      'Reavaliar a Hierarquia do Botão: Considere tornar "Finalizar ordem" um botão secundário (ex: com contorno, sem preenchimento sólido) para reduzir sua proeminência.',
  },
]

export default function ResultsScreen({
  imagePreview,
  imageName,
  score = 72,
  issues = mockIssues,
  onNewAnalysis,
}: ResultsScreenProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Alto":
        return "bg-red-100 text-red-800 border-red-200"
      case "Médio":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Baixo":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isMobileImage = () => {
    // This is a simple heuristic - in a real app you'd analyze the actual image dimensions
    return imageName?.toLowerCase().includes("mobile") || imageName?.toLowerCase().includes("phone")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-serif">Audito</div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white text-primary border-white hover:bg-gray-50">
                Sign up
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Browser Mockup (2/3 width) */}
          <div className="lg:col-span-2 lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              {/* Browser Header */}
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 mx-4">
                  
                </div>
              </div>

              {/* Image Container */}
              <div className="p-8 bg-gray-50 min-h-[600px] flex items-center justify-center px-[0] py-[0]">
                <div
                  className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                    isMobileImage() ? "max-w-md" : "w-full max-w-4xl"
                  }`}
                >
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt={`Análise de ${imageName}`}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Analysis Results (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {issues.map((issue, index) => (
              <div key={issue.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="space-y-3">
                  {/* Problem Header */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base mb-2">{issue.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">{issue.description}</p>
                    </div>
                  </div>

                  {/* Impact Section */}
                  <div className="ml-9">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Impacto</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      Em uma tela de monitoramento, a principal ação não é necessariamente "finalizar". Isso pode levar
                      a cliques acidentais que interrompem a produção.
                    </p>

                    {/* Impact Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(issue.impact)}`}
                      >
                        {issue.impact}
                      </span>
                    </div>

                    {/* Suggestion Section */}
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Sugestão</h4>
                    <div className="space-y-1">
                      <p className="text-gray-700 text-sm leading-relaxed">• {issue.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* New Analysis Button */}
            <div className="pt-4">
              <Button
                onClick={onNewAnalysis}
                className="w-full bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Nova Análise
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
