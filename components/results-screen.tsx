"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

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

export default function ResultsScreen({
  imagePreview,
  imageName,
  userContext = "Interface analisada",
  issues = [],
  onNewAnalysis,
}: ResultsScreenProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">

      {/* Main Content - Layout estilo Lovable com proporções 70/30 */}
      <main className="flex-1 flex overflow-hidden">
        {/* Canvas Central - 70% da largura, imagem full-width */}
        <div className="flex-[7] bg-gray-50 flex items-center justify-center p-6" style={{ overflow: "hidden" }}>
          <div className="w-full h-full flex items-center justify-center">
            {/* Browser Mockup */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-full h-full flex flex-col">
              {/* Browser Header */}
              <div className="bg-green-600 flex items-center gap-3 flex-shrink-0 px-4" style={{ height: "40px" }}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="rounded-lg px-4 py-2 text-sm text-white font-mono">
                    {/* Exibe a URL do site capturado, se disponível, senão o nome da imagem, senão fallback */}
                    {imageName ? imageName : (imagePreview ? imagePreview : "audito.dev")}
                  </div>
                </div>
              </div>
              
              {/* Área da imagem - Full-width sem scroll */}
              <div className="flex-1 bg-white overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Interface analisada"
                    className="w-full object-contain"
                    draggable={false}
                    style={{ 
                      pointerEvents: "none", 
                      userSelect: "none"
                    }}
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', imagePreview)
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500 h-full">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm">Imagem não disponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar Lateral - 30% da largura */}
        <div className="flex-[3] bg-white border-l border-gray-200 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar" style={{ scrollBehavior: "smooth" }}>
            <div className="p-6 space-y-6">
              {/* User Context Card */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Contexto do Usuário</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{userContext}</p>
                </div>
              </div>

              {/* Issues List */}
              {issues.map((issue, index) => (
                <div key={issue.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="space-y-4">
                    {/* Issue Header */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-gray-900 font-bold text-lg">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base mb-2">{issue.title}</h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {issue.category}
                        </span>
                      </div>
                    </div>

                    {/* Problem */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm font-semibold">Problema:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{issue.problem}</p>
                    </div>

                    {/* Impact */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm font-semibold">Impacto:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{issue.impact}</p>
                    </div>

                    {/* Suggestion */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm font-semibold">Sugestão:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{issue.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* New Analysis Button */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <Button 
                  onClick={onNewAnalysis}
                  className="w-full bg-primary hover:bg-primary/90 py-3"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Nova Análise
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* CSS personalizado para scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
      `}</style>
    </div>
  )
}
