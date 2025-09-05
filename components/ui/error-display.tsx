"use client"

import { AlertCircle, X, RefreshCw, ExternalLink, AlertTriangle, Info } from "lucide-react"
import { Button } from "./button"
import { motion, AnimatePresence } from "framer-motion"

export interface ErrorDisplayProps {
  error: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
  onDismiss?: () => void
  showDetails?: boolean
  className?: string
}

const errorConfig = {
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-800 dark:text-red-300',
    iconColor: 'text-red-500',
    buttonColor: 'bg-red-600 hover:bg-red-700 text-white'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    iconColor: 'text-yellow-500',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700 text-white'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-800 dark:text-blue-300',
    iconColor: 'text-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
  }
}

export default function ErrorDisplay({ 
  error, 
  type = 'error', 
  onRetry, 
  onDismiss, 
  showDetails = false,
  className = ""
}: ErrorDisplayProps) {
  const config = errorConfig[type]
  const Icon = config.icon

  // Função para extrair informações úteis do erro
  const parseError = (errorMessage: string) => {
    // Erros comuns do Puppeteer
    if (errorMessage.includes('executablePath') || errorMessage.includes('channel')) {
      return {
        title: "Erro de Configuração do Navegador",
        description: "O sistema não conseguiu configurar o navegador para capturar a página.",
        suggestion: "Tente novamente ou use uma URL de imagem direta.",
        isRetryable: true
      }
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return {
        title: "Timeout na Captura",
        description: "A página demorou muito para carregar ou responder.",
        suggestion: "Verifique se a URL está acessível e tente novamente.",
        isRetryable: true
      }
    }

    if (errorMessage.includes('net::ERR_') || errorMessage.includes('network')) {
      return {
        title: "Erro de Rede",
        description: "Não foi possível acessar a URL fornecida.",
        suggestion: "Verifique se a URL está correta e acessível.",
        isRetryable: true
      }
    }

    if (errorMessage.includes('Formato não suportado') || errorMessage.includes('formato')) {
      return {
        title: "Formato Não Suportado",
        description: "O arquivo enviado não está em um formato válido.",
        suggestion: "Use apenas arquivos PNG, JPG ou JPEG.",
        isRetryable: false
      }
    }

    if (errorMessage.includes('muito grande') || errorMessage.includes('size')) {
      return {
        title: "Arquivo Muito Grande",
        description: "O arquivo excede o tamanho máximo permitido.",
        suggestion: "Reduza o tamanho do arquivo para menos de 5MB.",
        isRetryable: false
      }
    }

    if (errorMessage.includes('URL inválida') || errorMessage.includes('URL')) {
      return {
        title: "URL Inválida",
        description: "A URL fornecida não é válida ou não está acessível.",
        suggestion: "Verifique se a URL está correta e começa com http:// ou https://.",
        isRetryable: false
      }
    }

    // Erro genérico
    return {
      title: "Erro na Análise",
      description: errorMessage,
      suggestion: "Tente novamente ou verifique os dados fornecidos.",
      isRetryable: true
    }
  }

  const errorInfo = parseError(error)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`rounded-xl border-2 ${config.bgColor} ${config.borderColor} p-6 shadow-lg ${className}`}
      >
        <div className="flex items-start gap-4">
          {/* Ícone de erro */}
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
          </div>

          {/* Conteúdo do erro */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg ${config.textColor} mb-2`}>
              {errorInfo.title}
            </h3>
            
            <p className={`text-sm ${config.textColor} mb-3 leading-relaxed`}>
              {errorInfo.description}
            </p>

            {showDetails && (
              <details className="mb-4">
                <summary className={`text-xs ${config.textColor} cursor-pointer hover:underline`}>
                  Detalhes técnicos
                </summary>
                <div className={`mt-2 p-3 rounded-lg bg-black/5 dark:bg-white/5 ${config.textColor} text-xs font-mono`}>
                  {error}
                </div>
              </details>
            )}

            <div className={`text-sm ${config.textColor} mb-4 p-3 rounded-lg bg-black/5 dark:bg-white/5`}>
              <strong>💡 Sugestão:</strong> {errorInfo.suggestion}
            </div>

            {/* Ações */}
            <div className="flex flex-wrap gap-3">
              {onRetry && errorInfo.isRetryable && (
                <Button
                  onClick={onRetry}
                  size="sm"
                  className={`${config.buttonColor} font-medium`}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}

              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  variant="outline"
                  size="sm"
                  className={`${config.textColor} border-current hover:bg-current/10`}
                >
                  <X className="w-4 h-4 mr-2" />
                  Fechar
                </Button>
              )}

              {/* Link para ajuda se for erro de Puppeteer */}
              {(error.includes('executablePath') || error.includes('puppeteer')) && (
                <Button
                  variant="outline"
                  size="sm"
                  className={`${config.textColor} border-current hover:bg-current/10`}
                  onClick={() => window.open('https://vercel.com/docs/functions/serverless-functions/runtimes#browser', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Documentação
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
