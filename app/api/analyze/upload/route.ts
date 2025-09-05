import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Inicializa cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Verifica se a API key está configurada
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY não está configurada no arquivo .env.local');
}

// Configurações
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Função para validar arquivo
function validateFile(file: File): { isValid: boolean; error?: string; errorType?: 'error' | 'warning' | 'info' } {
  // Verifica tamanho
  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: `Arquivo muito grande. Máximo permitido: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      errorType: 'warning'
    };
  }

  // Verifica extensão
  const fileExtension = file.name.toLowerCase().split('.').pop();
  if (!fileExtension || !ALLOWED_EXTENSIONS.includes(`.${fileExtension}`)) {
    return { 
      isValid: false, 
      error: `Formato não suportado. Use: ${ALLOWED_EXTENSIONS.join(', ')}`,
      errorType: 'error'
    };
  }

  // Verifica tipo MIME
  if (!file.type.startsWith('image/')) {
    return { 
      isValid: false, 
      error: 'Arquivo deve ser uma imagem válida',
      errorType: 'error'
    };
  }

  return { isValid: true };
}

// Função para otimizar imagem
async function optimizeImage(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  // Para simplicidade, retornamos o buffer original
  // Em produção, você pode usar sharp ou outras bibliotecas para otimização
  return buffer;
}

// Função para criar prompt de análise
function createAnalysisPrompt(productContext: string): string {
  const systemContext = productContext || "interface de usuário";
  
  return `Act as a Senior Product Designer with extensive experience in usability and interface design for ${systemContext}.
Your task is to provide a critical and constructive analysis of the provided screen. The goal is to identify strengths and weaknesses, always focusing on improving user experience and product efficiency.

Please structure your analysis under the following topics:

**User Context and Primary Objective:**
Based on the interface, describe what you believe is the user's main objective on this screen and in what context they would be using it.

**Improvement Opportunities (Detailed Critique):**
Identify three areas that could be enhanced. For each, organize your critique strictly using the following format: Problem-Impact-Suggestion:

**Problem:** Objectively describe the design or usability issue.

**Impact:** Explain why this is a problem for the user (e.g., increases cognitive load, may lead to errors, disrupts visual hierarchy, lowers efficiency).

**Suggestion:** Provide one or more concrete, actionable solutions to address the identified issue.

**Formato de Resposta JSON:**
Forneça sua análise no seguinte formato JSON:

{
    "overall_assessment": "Breve avaliação geral da interface",
    "user_context": "Descrição do contexto do usuário e objetivo principal",
    "recommendations": [
        {
            "id": "1",
            "title": "Título da recomendação",
            "problem": "Descrição objetiva do problema de design ou usabilidade",
            "impact": "Explicação do impacto negativo para o usuário",
            "suggestion": "Solução concreta e acionável para resolver o problema",
            "category": "Usabilidade|Acessibilidade|Visual|Navegação|Hierarquia"
        }
    ]
}

**Critérios de Avaliação:**
- Usabilidade: Facilidade de uso e compreensão
- Acessibilidade: Inclusão de usuários com diferentes necessidades
- Visual: Hierarquia, contraste e organização
- Navegação: Clareza e intuitividade da interface
- Hierarquia: Estrutura visual e importância dos elementos

Seja específico, construtivo e focado em melhorias práticas. Analise como um designer experiente que quer criar a melhor experiência possível para o usuário.`;
}

// Função para processar resposta do OpenAI
function processAnalysisResponse(content: string): any {
  try {
    // Tenta extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      return JSON.parse(jsonStr);
    } else {
      // Se não encontrar JSON, cria resposta estruturada
      return {
        overall_assessment: "Análise realizada com sucesso",
        user_context: "Contexto do usuário analisado",
        recommendations: [
          {
            id: "1",
            title: "Análise de Interface",
            problem: "Problema identificado na interface",
            impact: "Impacto na experiência do usuário",
            suggestion: "Sugestão de melhoria",
            category: "Usabilidade"
          }
        ]
      };
    }
  } catch (error) {
    console.error('Erro ao processar resposta:', error);
    return {
      overall_assessment: "Erro na análise",
      user_context: "Erro na análise",
      recommendations: [
        {
          id: "error",
          title: "Erro na Análise",
          problem: "Ocorreu um erro durante a análise",
          impact: "Análise não pôde ser concluída",
          suggestion: "Tente novamente ou verifique a imagem fornecida",
          category: "Erro"
        }
      ]
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verifica se a API key está configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OPENAI_API_KEY não está configurada. Crie um arquivo .env.local com sua chave da API OpenAI.',
          error_type: 'error',
          overall_assessment: "Erro de configuração",
          user_context: "Erro de configuração",
          recommendations: []
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productContext = formData.get('product_context') as string || '';

    // Valida arquivo
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          error_type: validation.errorType || 'error',
          overall_assessment: "Erro na validação",
          user_context: "Erro na validação",
          recommendations: []
        },
        { status: 400 }
      );
    }

    // Converte arquivo para buffer
    const buffer = await file.arrayBuffer();
    
    // Otimiza imagem
    const optimizedBuffer = await optimizeImage(buffer);
    
    // Converte para base64
    const base64 = Buffer.from(optimizedBuffer).toString('base64');
    
    // Cria prompt de análise
    const prompt = createAnalysisPrompt(productContext);
    
    console.log(`🔄 Enviando análise para OpenAI com ${optimizedBuffer.byteLength} bytes de imagem...`);

    // Chama OpenAI GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000
    });

    console.log("✅ Análise do OpenAI concluída com sucesso");

    // Processa resposta
    const content = response.choices[0].message.content;
    const analysisResult = processAnalysisResponse(content || '{}');

    // Adiciona informações da imagem
    const imageInfo = {
      format: file.type,
      size: file.size,
      width: 0, // Seria necessário processar a imagem para obter dimensões
      height: 0,
      file_size: file.size
    };

    // Formata resposta final
    const formattedResult = {
      success: true,
      overall_assessment: analysisResult.overall_assessment || "Análise concluída",
      user_context: analysisResult.user_context || productContext || "Contexto não especificado",
      recommendations: analysisResult.recommendations || [],
      image_info: imageInfo,
      analysis_timestamp: Date.now()
    };

    return NextResponse.json(formattedResult);

  } catch (error) {
    console.error('❌ Erro na análise:', error);
    
    // Melhora as mensagens de erro para serem mais claras
    let errorMessage = 'Erro desconhecido na análise';
    let errorType = 'error';
    
    if (error instanceof Error) {
      const message = error.message;
      
      if (message.includes('API key') || message.includes('OPENAI')) {
        errorMessage = 'Erro de configuração da API OpenAI. Verifique se a chave está configurada corretamente.';
        errorType = 'error';
      } else if (message.includes('quota') || message.includes('rate limit')) {
        errorMessage = 'Limite de uso da API excedido. Tente novamente mais tarde.';
        errorType = 'warning';
      } else if (message.includes('timeout') || message.includes('Timeout')) {
        errorMessage = 'A análise demorou muito para ser concluída. Tente novamente.';
        errorType = 'warning';
      } else if (message.includes('network') || message.includes('fetch')) {
        errorMessage = 'Erro de conexão com a API. Verifique sua internet e tente novamente.';
        errorType = 'error';
      } else {
        errorMessage = `Erro na análise: ${message}`;
        errorType = 'error';
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        error_type: errorType,
        overall_assessment: "Erro na análise",
        user_context: "Erro na análise",
        recommendations: []
      },
      { status: 500 }
    );
  }
}
