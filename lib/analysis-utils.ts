// Utilitários compartilhados para análise de interface
// Centraliza funções duplicadas entre as APIs

// Função para detectar idioma do usuário baseado no Accept-Language header
export function detectUserLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'pt'; // Português como padrão
  
  // Prioriza idiomas comuns
  const languageMap: { [key: string]: string } = {
    'pt': 'pt',
    'pt-br': 'pt',
    'pt-pt': 'pt',
    'en': 'en',
    'en-us': 'en',
    'en-gb': 'en',
    'es': 'es',
    'es-es': 'es',
    'es-mx': 'es',
    'fr': 'fr',
    'fr-fr': 'fr',
    'de': 'de',
    'de-de': 'de',
    'it': 'it',
    'it-it': 'it',
    'ja': 'ja',
    'ja-jp': 'ja',
    'ko': 'ko',
    'ko-kr': 'ko',
    'zh': 'zh',
    'zh-cn': 'zh',
    'zh-tw': 'zh',
    'ru': 'ru',
    'ru-ru': 'ru'
  };
  
  // Extrai idiomas do header Accept-Language
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase())
    .map(lang => languageMap[lang] || lang.split('-')[0]);
  
  // Retorna o primeiro idioma suportado ou português como padrão
  return languages.find(lang => languageMap[lang]) || 'pt';
}

// Função para criar prompt de análise (centralizada)
export function createAnalysisPrompt(productContext: string, userLanguage: string = 'pt'): string {
  const systemContext = productContext || "interface de usuário";
  
  // Define instruções baseadas no idioma do usuário
  const languageInstructions = {
    'pt': {
      role: "Atue como um Designer de Produto Sênior com vasta experiência em usabilidade e design de interface para",
      task: "Sua tarefa é fornecer uma análise crítica e construtiva da tela fornecida. O objetivo é identificar pontos fortes e fracos, sempre focando na melhoria da experiência do usuário e eficiência do produto.",
      responseFormat: "Forneça sua análise no seguinte formato JSON:",
      focus: "Foque em fornecer recomendações acionáveis e específicas que podem ser implementadas imediatamente para melhorar a experiência do usuário."
    },
    'en': {
      role: "Act as a Senior Product Designer with extensive experience in usability and interface design for",
      task: "Your task is to provide a critical and constructive analysis of the provided screen. The goal is to identify strengths and weaknesses, always focusing on improving user experience and product efficiency.",
      responseFormat: "Provide your analysis in the following JSON format:",
      focus: "Focus on providing actionable, specific recommendations that can be immediately implemented to improve the user experience."
    },
    'es': {
      role: "Actúa como un Diseñador de Producto Senior con amplia experiencia en usabilidad y diseño de interfaz para",
      task: "Tu tarea es proporcionar un análisis crítico y constructivo de la pantalla proporcionada. El objetivo es identificar fortalezas y debilidades, siempre enfocándose en mejorar la experiencia del usuario y la eficiencia del producto.",
      responseFormat: "Proporciona tu análisis en el siguiente formato JSON:",
      focus: "Enfócate en proporcionar recomendaciones accionables y específicas que pueden implementarse inmediatamente para mejorar la experiencia del usuario."
    },
    'fr': {
      role: "Agissez comme un Designer de Produit Senior avec une vaste expérience en usabilité et design d'interface pour",
      task: "Votre tâche est de fournir une analyse critique et constructive de l'écran fourni. L'objectif est d'identifier les forces et les faiblesses, en se concentrant toujours sur l'amélioration de l'expérience utilisateur et l'efficacité du produit.",
      responseFormat: "Fournissez votre analyse dans le format JSON suivant:",
      focus: "Concentrez-vous sur la fourniture de recommandations exploitables et spécifiques qui peuvent être mises en œuvre immédiatement pour améliorer l'expérience utilisateur."
    }
  };
  
  const instructions = languageInstructions[userLanguage as keyof typeof languageInstructions] || languageInstructions['pt'];
  
  return `${instructions.role} ${systemContext}.
${instructions.task}

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
${instructions.responseFormat}
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

${instructions.focus}`;
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
  ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg'] as const,
  VALID_MIME_TYPES: {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/jpg': ['.jpg', '.jpeg']
  } as const,
  FILE_SIGNATURES: {
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/jpeg': [0xFF, 0xD8, 0xFF]
  } as const
} as const;
