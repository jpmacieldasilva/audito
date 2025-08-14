"use client"

import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
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
    title: "Contraste insuficiente",
    description: "O texto cinza sobre fundo branco não atende aos padrões de acessibilidade WCAG.",
    impact: "Alto",
    suggestion: "Use uma cor mais escura para o texto ou aumente o peso da fonte para melhorar a legibilidade.",
  },
  {
    id: "2",
    title: "Espaçamento inconsistente",
    description: "Os elementos possuem espaçamentos variados que prejudicam a harmonia visual.",
    impact: "Médio",
    suggestion: "Padronize os espaçamentos usando um sistema de grid de 8px ou 4px.",
  },
  {
    id: "3",
    title: "Hierarquia visual pouco clara",
    description: "Os títulos e subtítulos não possuem diferenciação suficiente de tamanho.",
    impact: "Médio",
    suggestion: "Aumente a diferença de tamanho entre os níveis de título para criar melhor hierarquia.",
  },
  {
    id: "4",
    title: "Botão sem estado de hover",
    description: "O botão principal não possui feedback visual ao passar o mouse.",
    impact: "Baixo",
    suggestion: "Adicione um estado de hover com mudança sutil de cor ou sombra.",
  },
]

export default function ResultsScreen({
  imagePreview,
  imageName,
  score = 72,
  issues = mockIssues,
  onNewAnalysis,
}: ResultsScreenProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

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

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "Alto":
        return <XCircle className="w-4 h-4" />
      case "Médio":
        return <AlertTriangle className="w-4 h-4" />
      case "Baixo":
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-3 leading-tight">
              Resultado da Análise
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-medium">Companion Design Auditor</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Image and Score */}
          <div className="space-y-8">
            {/* Image */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt={`Análise de ${imageName}`}
                className="w-full rounded-lg shadow-sm"
              />
              <div className="mt-4 text-center">
                <p className="font-medium text-black">{imageName}</p>
              </div>
            </div>

            {/* Score */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center">
              <h3 className="text-xl font-semibold text-black mb-6">Pontuação Geral</h3>

              <div className="space-y-4">
                <div className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${getScoreBarColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <p className="text-gray-600 font-medium">
                  {score >= 80
                    ? "Excelente design!"
                    : score >= 50
                      ? "Bom design com melhorias possíveis"
                      : "Design precisa de atenção"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Issues */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-black mb-6">Problemas Detectados ({issues.length})</h3>

              <div className="space-y-6">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow duration-200"
                  >
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-semibold text-black text-lg leading-tight">{issue.title}</h4>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getImpactColor(issue.impact)}`}
                        >
                          {getImpactIcon(issue.impact)}
                          {issue.impact}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed">{issue.description}</p>

                      {/* Suggestion */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 font-medium text-sm">
                          <strong>Sugestão:</strong> {issue.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Analysis Button */}
            <div className="pt-8">
              <Button
                onClick={onNewAnalysis}
                className="w-full bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Nova Análise
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
