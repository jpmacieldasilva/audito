"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Issue {
  id: string
  title: string
  problem: string
  impact: string
  suggestion: string
  category: string
}

interface ResultsScreenProps {
  imagePreview: string
  imageName: string
  userContext: string
  issues: Issue[]
  onNewAnalysis: () => void
}

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Problema de Hierarquia Visual",
    problem: "O botão 'Finalizar ordem' é a ação mais proeminente na tela (botão primário).",
    impact: "Pode levar a cliques acidentais que interrompem a produção, aumentando o risco de erros operacionais.",
    suggestion: "Reavaliar a hierarquia do botão e adicionar confirmação antes da execução.",
    category: "Hierarquia"
  },
  {
    id: "2",
    title: "Falta de Confirmação",
    problem: "Ações críticas não possuem confirmação antes da execução.",
    impact: "Aumenta a probabilidade de ações não intencionais, especialmente em ambientes de produção.",
    suggestion: "Implementar modais de confirmação para ações críticas com opção de cancelamento.",
    category: "Usabilidade"
  },
  {
    id: "3",
    title: "Organização de Elementos",
    problem: "Elementos de controle estão distribuídos de forma não intuitiva na interface.",
    impact: "Reduz a eficiência do usuário e aumenta o tempo de aprendizado da interface.",
    suggestion: "Agrupar elementos relacionados e criar uma hierarquia visual clara.",
    category: "Visual"
  },
]

export default function ResultsScreen({
  imagePreview,
  imageName,
  userContext = "Interface analisada",
  issues = mockIssues,
  onNewAnalysis,
}: ResultsScreenProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <header className="bg-primary text-white flex-shrink-0">
        
      </header>

      {/* Main Content - Altura fixa com overflow hidden */}
      <main className="flex-1 overflow-hidden flex">
        <div className="h-full w-full max-w-7xl mx-auto px-6 py-6 flex">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full w-full">
            {/* Área do Browser - Estática, sem scroll */}
            <div className="lg:col-span-3 h-full overflow-hidden">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col overflow-hidden">
                {/* Browser Header */}
                <div className="bg-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Área da imagem - flexível, mas sem scroll */}
                {/* 
                  Área da imagem travada na tela, sem scroll.
                  O container e a imagem ocupam todo o espaço disponível, sem permitir rolagem.
                  O overflow está oculto e a imagem é centralizada e contida.
                */}
                <div className="flex-1 bg-white overflow-hidden flex items-center justify-center p-0 h-full w-full">
                  <img
                    src={
                      imagePreview ||
                      "/placeholder.svg?height=700&width=1200&query=Payment Made Easier landing page with mobile app mockup and company logos"
                    }
                    alt="Interface analisada"
                    className="object-contain h-full w-full"
                    draggable={false}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Área das Sugestões - Com scroll */}
            <div className="lg:col-span-1 h-full overflow-hidden">
              <div className="h-full overflow-y-auto space-y-6 pr-2 pb-6">
                {/* User Context Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 text-lg">Contexto do Usuário</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{userContext}</p>
                  </div>
                </div>

                {/* Issues List */}
                {issues.map((issue, index) => (
                  <div key={issue.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="space-y-4">
                      {/* Issue Header */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-gray-900 font-semibold text-base">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base">{issue.title}</h3>
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                            {issue.category}
                          </span>
                        </div>
                      </div>

                      {/* Problem */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Problema:</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{issue.problem}</p>
                      </div>

                      {/* Impact */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Impacto:</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{issue.impact}</p>
                      </div>

                      {/* Suggestion */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Sugestão:</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{issue.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* New Analysis Button */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <Button 
                    onClick={onNewAnalysis}
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Nova Análise
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
