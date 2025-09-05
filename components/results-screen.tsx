"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, AlertTriangle, Info, Lightbulb, Target, Sparkles, Zap } from "lucide-react"

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
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'acessibilidade':
        return <CheckCircle className="w-4 h-4" />
      case 'usabilidade':
        return <Target className="w-4 h-4" />
      case 'design':
        return <Sparkles className="w-4 h-4" />
      case 'performance':
        return <Zap className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'acessibilidade':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
      case 'usabilidade':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700'
      case 'design':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700'
      case 'performance':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col">

      {/* Main Content - Layout estilo Lovable com proporções 70/30 */}
      <main className="flex-1 flex overflow-hidden">
        {/* Canvas Central - 70% da largura, imagem full-width */}
        <div className="flex-[7] bg-muted flex items-center justify-center p-6" style={{ overflow: "hidden" }}>
          <div className="w-full h-full flex items-center justify-center">
            {/* Browser Mockup */}
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden w-full h-full flex flex-col">
              {/* Browser Header */}
              <div className="bg-green-600 flex items-center gap-3 flex-shrink-0 px-4" style={{ height: "40px" }}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="rounded-lg px-4 py-2 text-sm text-white font-mono bg-black/20">
                    {imageName ? imageName : (imagePreview ? imagePreview : "audito.dev")}
                  </div>
                </div>
              </div>
              
              {/* Área da imagem - Full-width sem scroll */}
              <div className="flex-1 bg-card overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Interface analisada"
                    className="w-full h-full object-cover"
                    draggable={false}
                    style={{ 
                      pointerEvents: "none", 
                      userSelect: "none",
                      objectFit: "cover",
                      objectPosition: "top center"
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
                    <p className="text-sm font-medium">Imagem não disponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar Lateral - 30% da largura */}
        <div className="flex-[3] bg-card border-l border-border overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar" style={{ scrollBehavior: "smooth" }}>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Análise Concluída
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  {issues.length} insights encontrados
                </p>
              </div>

              {/* User Context Card */}
              <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Contexto do Usuário
                  </h3>
                  <p className="text-foreground text-sm leading-relaxed font-medium">{userContext}</p>
                </div>
              </div>

              {/* Issues List */}
              {issues.length > 0 ? (
                <div className="space-y-4">
                  {issues.map((issue, index) => (
                    <div key={issue.id} className="bg-card rounded-xl p-6 border border-border shadow-sm">
                      <div className="space-y-4">
                        {/* Issue Header */}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-800 to-slate-700 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-base mb-2">{issue.title}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(issue.category)}`}>
                              {getCategoryIcon(issue.category)}
                              {issue.category}
                            </span>
                          </div>
                        </div>

                        {/* Problem */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            Problema:
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed font-medium">{issue.problem}</p>
                        </div>

                        {/* Impact */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <Target className="w-4 h-4 text-orange-500" />
                            Impacto:
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed font-medium">{issue.impact}</p>
                        </div>

                        {/* Suggestion */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            Sugestão:
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed font-medium">{issue.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 text-center border border-green-200 dark:border-green-800 shadow-sm">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Excelente!</h3>
                  <p className="text-foreground font-medium">
                    Nenhum problema crítico foi encontrado em sua interface. 
                    Continue mantendo esses padrões de qualidade!
                  </p>
                </div>
              )}

              {/* New Analysis Button */}
              <div className="bg-muted rounded-xl p-6 border border-border shadow-sm">
                <Button 
                  onClick={onNewAnalysis}
                  className="w-full bg-gradient-to-r from-blue-800 to-slate-700 hover:from-blue-900 hover:to-slate-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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