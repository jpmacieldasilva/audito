"use client"

import ErrorDisplay from "./error-display"

// Componente de demonstração dos diferentes tipos de erro
export default function ErrorExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Exemplos de Erros Melhorados</h2>
      
      {/* Erro de configuração do Puppeteer */}
      <ErrorDisplay
        error="Error: An `executablePath` or `channel` must be specified for `puppeteer-core`"
        type="warning"
        onRetry={() => // Retry action}
        onDismiss={() => // Dismiss action}
        showDetails={true}
      />

      {/* Erro de arquivo muito grande */}
      <ErrorDisplay
        error="Arquivo muito grande. Máximo 5MB."
        type="warning"
        onRetry={() => // Retry action}
        onDismiss={() => // Dismiss action}
        showDetails={false}
      />

      {/* Erro de formato não suportado */}
      <ErrorDisplay
        error="Formato não suportado. Use PNG ou JPG."
        type="error"
        onRetry={() => // Retry action}
        onDismiss={() => // Dismiss action}
        showDetails={false}
      />

      {/* Erro de URL inválida */}
      <ErrorDisplay
        error="URL inválida. Verifique o formato."
        type="error"
        onRetry={() => // Retry action}
        onDismiss={() => // Dismiss action}
        showDetails={false}
      />

      {/* Erro de timeout */}
      <ErrorDisplay
        error="A página demorou muito para carregar. Tente novamente ou use uma URL de imagem direta."
        type="warning"
        onRetry={() => // Retry action}
        onDismiss={() => // Dismiss action}
        showDetails={true}
      />

      {/* Erro de rede */}
      <ErrorDisplay
        error="Não foi possível acessar a URL. Verifique se está correta e acessível."
        type="error"
        onRetry={() => // Retry action}
        onDismiss={() => // Dismiss action}
        showDetails={true}
      />

      {/* Erro de API key */}
      <ErrorDisplay
        error="OPENAI_API_KEY não está configurada. Crie um arquivo .env.local com sua chave da API OpenAI."
        type="error"
        onRetry={() => // Retry action}
        onDismiss={() => // Dismiss action}
        showDetails={true}
      />

      {/* Erro de quota excedida */}
      <ErrorDisplay
        error="Limite de uso da API excedido. Tente novamente mais tarde."
        type="warning"
        onRetry={() => // Retry action}
        onDismiss={() => // Dismiss action}
        showDetails={false}
      />
    </div>
  )
}
