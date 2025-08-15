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
    suggestion: "Reavaliar a Hierarquia do Botão e Adicionar Confirmação",
  },
  {
    id: "2",
    title: "Problema",
    description: 'O botão "Finalizar ordem" é a ação mais proeminente na tela (botão primário).',
    impact: "Médio",
    suggestion: "Reavaliar a Hierarquia do Botão",
  },
  {
    id: "3",
    title: "Problema",
    description: 'O botão "Finalizar ordem" é a ação mais proeminente na tela (botão primário).',
    impact: "Baixo",
    suggestion: "Reavaliar a Hierarquia do Botão",
  },
]

export default function ResultsScreen({
  imagePreview,
  imageName,
  score = 72,
  issues = mockIssues,
  onNewAnalysis,
}: ResultsScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white">
        
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              {/* Browser Header */}
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                
              </div>

              <div className="p-0 bg-white min-h-[700px]">
                <img
                  src={
                    imagePreview ||
                    "/placeholder.svg?height=700&width=1200&query=Payment Made Easier landing page with mobile app mockup and company logos"
                  }
                  alt="Payment Made Easier - Global Pay landing page"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {issues.map((issue, index) => (
              <div key={issue.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="space-y-3">
                  {/* Problem Header */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span className="text-gray-900 font-semibold text-base">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{issue.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="ml-6">
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">{issue.description}</p>
                  </div>

                  {/* Impact Section */}
                  <div className="ml-6">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Impacto</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Em uma tela de monitoramento, a principal ação não é necessariamente "finalizar". Isso pode levar
                      a cliques acidentais que interrompem a produção.
                    </p>

                    {/* Suggestion Section */}
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Sugestão</h4>
                    <div className="space-y-2">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        • Reavaliar a Hierarquia do Botão: Considere tornar "Finalizar ordem" um botão secundário (ex:
                        com contorno, sem preenchimento sólido) para reduzir sua proeminência.
                      </p>
                      {index === 0 && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          • Adicionar Confirmação: Ao clicar em "Finalizar ordem", exiba um modal de confirmação ("Você
                          tem certeza que deseja finalizar a Ordem 00000000? Esta ação não pode ser desfeita.") para
                          prevenir erros.
                        </p>
                      )}
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
