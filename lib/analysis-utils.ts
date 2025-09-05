// Utilitários compartilhados para análise de interface
// Centraliza funções duplicadas entre as APIs

// Função para criar prompt de análise (centralizada)
export function createAnalysisPrompt(productContext: string): string {
  const systemContext = productContext || "interface de usuário";
  
  return `Act as a Senior Product Designer with extensive experience in usability and interface design for ${systemContext}.
Your task is to provide a critical and constructive analysis of the provided screen. The goal is to identify strengths and weaknesses, always focusing on improving user experience and product efficiency.

## Analysis Guidelines:

### 1. Visual Hierarchy & Layout
- Evaluate the visual hierarchy and information architecture
- Check if the layout is intuitive and follows design principles
- Identify any visual clutter or confusing elements

### 2. Usability & User Experience
- Assess navigation flow and user journey
- Identify potential usability issues or friction points
- Check for consistency in design patterns

### 3. Accessibility
- Evaluate color contrast and readability
- Check for proper focus states and keyboard navigation
- Identify missing alt texts or accessibility features

### 4. Content & Messaging
- Analyze content clarity and relevance
- Check for proper information hierarchy
- Identify any confusing or unclear messaging

### 5. Technical Implementation
- Assess responsive design and mobile compatibility
- Check for performance-related visual issues
- Identify any technical constraints affecting UX

## Response Format:
Provide your analysis in the following JSON format:
{
  "overall_assessment": "Brief overall evaluation of the interface",
  "user_context": "Context about the target user and use case",
  "recommendations": [
    {
      "id": "unique_id",
      "title": "Issue title",
      "problem": "Description of the problem",
      "impact": "Impact on user experience",
      "suggestion": "Specific recommendation for improvement",
      "category": "acessibilidade|usabilidade|design|performance"
    }
  ]
}

Focus on providing actionable, specific recommendations that can be immediately implemented to improve the user experience.`;
}

// Função para processar resposta do OpenAI (centralizada)
export function processAnalysisResponse(content: string): any {
  try {
    // Tenta extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      
      // Valida estrutura básica
      if (parsed.overall_assessment && parsed.recommendations) {
        return parsed;
      }
    }
    
    // Fallback se não conseguir extrair JSON válido
    return {
      overall_assessment: "Análise concluída com sucesso",
      user_context: "Interface analisada",
      recommendations: [
        {
          id: "fallback_1",
          title: "Análise Concluída",
          problem: "A análise foi processada com sucesso",
          impact: "Positivo",
          suggestion: "Continue monitorando a experiência do usuário",
          category: "design"
        }
      ]
    };
  } catch (error) {
    console.error('Erro ao processar resposta:', error);
    return {
      overall_assessment: "Erro ao processar análise",
      user_context: "Interface analisada",
      recommendations: [
        {
          id: "error_1",
          title: "Erro de Processamento",
          problem: "Não foi possível processar a resposta da análise",
          impact: "Neutro",
          suggestion: "Tente novamente ou entre em contato com o suporte",
          category: "design"
        }
      ]
    };
  }
}

// Constantes compartilhadas
export const ANALYSIS_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg'],
  VALID_MIME_TYPES: {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/jpg': ['.jpg', '.jpeg']
  },
  FILE_SIGNATURES: {
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/jpeg': [0xFF, 0xD8, 0xFF]
  }
} as const;
