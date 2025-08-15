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
    suggestion: "",
  },
  {
    id: "2",
    title: "Problema",
    description: 'O botão "Finalizar ordem" é a ação mais proeminente na tela (botão primário).',
    impact: "Médio",
    suggestion: "",
  },
  {
    id: "3",
    title: "Problema",
    description: 'O botão "Finalizar ordem" é a ação mais proeminente na tela (botão primário).',
    impact: "Baixo",
    suggestion: "",
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-serif">Audito</div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white text-primary hover:bg-gray-50 px-6 py-2 rounded-lg font-medium"
              >
                Sign up
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-6 py-2 rounded-lg font-medium bg-transparent"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="flex-1" style={{ maxWidth: "65%" }}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 mx-4 text-white text-sm">/ support@global.pay</div>
                <div className="text-white text-sm flex items-center gap-4">
                  <span>Currency</span>
                  <span>Data</span>
                  <span>Web App</span>
                  <span>Payment</span>
                  <span>En 🌐</span>
                  <span>Login</span>
                  <span>Try Demo →</span>
                </div>
              </div>

              <div className="p-8 bg-white min-h-[600px]">
                <div className="space-y-8">
                  {/* Hero section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Payment Made
                        <br />
                        Easier ~
                      </h1>
                      <div className="text-lg text-gray-600">
                        <span>/</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-gray-100 px-4 py-2 rounded-lg inline-block mb-2">
                        Send Global Payment
                        <br />
                        In 10 Mins
                      </div>
                      <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
                        Send →
                      </Button>
                    </div>
                  </div>

                  {/* Mobile and desktop mockups */}
                  <div className="flex gap-8 items-center">
                    {/* Mobile mockup */}
                    <div className="bg-purple-100 p-6 rounded-2xl">
                      <div className="bg-black rounded-2xl p-4 w-48">
                        <div className="bg-white rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Account Linked</span>
                            <span>+</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-2xl font-bold">$20,000</span>
                              <span className="text-lg">$15,000</span>
                            </div>
                            <div className="text-sm text-gray-500">Today's Income</div>
                          </div>
                          <div className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-purple-200 rounded"></div>
                                <div className="flex-1 h-2 bg-gray-100 rounded"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop section */}
                    <div className="bg-green-100 p-6 rounded-2xl flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                          ✱
                        </div>
                        <span className="font-semibold">Global Pay</span>
                        <div className="ml-auto flex items-center gap-2">
                          <span>David</span>
                          <span>Received Payment 👋</span>
                        </div>
                      </div>

                      <div className="bg-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-black rounded-full"></div>
                          <div className="bg-white px-3 py-1 rounded-full text-sm">Upfront sent — 💰</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-8">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 h-1 bg-black"></div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">🌍</div>
                        <div className="flex-1 h-1 bg-black"></div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">⚡</div>
                      </div>
                    </div>
                  </div>

                  {/* Company logos */}
                  <div className="flex items-center justify-between text-xl font-bold text-gray-800">
                    <span>Rakuten</span>
                    <span>⊕NCR</span>
                    <span>monday.com</span>
                    <span>Disney</span>
                    <span>Dropbox</span>
                  </div>

                  {/* Bottom text */}
                  <div className="text-4xl font-bold text-gray-900">
                    Now we've made — capital accessible
                    <br />
                    even more companies 👤 directly through
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-80 space-y-4">
            {issues.map((issue, index) => (
              <div key={issue.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-semibold text-gray-900">{index + 1}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">{issue.description}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Impacto</h4>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      Em uma tela de monitoramento, a principal ação não é necessariamente "finalizar". Isso pode levar
                      a cliques acidentais que interrompem a produção.
                    </p>

                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Sugestão</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        • Reavaliar a Hierarquia do Botão: Considere tornar "Finalizar ordem" um botão secundário (ex:
                        com contorno, sem preenchimento sólido) para reduzir sua proeminência.
                      </p>
                      <p>
                        • Adicionar Confirmação: Ao clicar em "Finalizar ordem", exiba um modal de confirmação ("Você
                        tem certeza que deseja finalizar a Ordem 00000000? Esta ação não pode ser desfeita.") para
                        prevenir erros.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Button
                onClick={onNewAnalysis}
                className="w-full bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Nova Análise
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
