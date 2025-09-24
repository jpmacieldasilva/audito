import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getClientIP, checkRateLimit } from '@/lib/rate-limit';
import { generateFileHash, CACHE_CONFIG } from '@/lib/cache';
import { createAnalysisPrompt, processAnalysisResponse, detectUserLanguage, ANALYSIS_CONSTANTS } from '@/lib/analysis-utils';
import cache from '@/lib/cache';

// Inicializa cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Verifica se a API key está configurada
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY não está configurada no arquivo .env.local');
}

// Configurações (usando constantes centralizadas)
const { MAX_FILE_SIZE, ALLOWED_EXTENSIONS, VALID_MIME_TYPES, FILE_SIGNATURES } = ANALYSIS_CONSTANTS;

// Função para validar assinatura de arquivo
async function validateFileSignature(file: File, expectedMimeType: string): Promise<boolean> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const signature = FILE_SIGNATURES[expectedMimeType as keyof typeof FILE_SIGNATURES];
    
    if (!signature) return false;
    
    // Verifica se a assinatura corresponde aos primeiros bytes do arquivo
    for (let i = 0; i < signature.length; i++) {
      if (uint8Array[i] !== signature[i]) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

// Função para validar arquivo com verificações de segurança aprimoradas
async function validateFile(file: File): Promise<{ isValid: boolean; error?: string; errorType?: 'error' | 'warning' | 'info' }> {
  // Verifica tamanho
  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: `Arquivo muito grande. Máximo permitido: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      errorType: 'warning'
    };
  }

  // Verifica se o arquivo não está vazio
  if (file.size === 0) {
    return { 
      isValid: false, 
      error: 'Arquivo vazio não é permitido',
      errorType: 'error'
    };
  }

  // Verifica extensão
  const fileExtension = file.name.toLowerCase().split('.').pop();
  const fullExtension = fileExtension ? `.${fileExtension}` : '';
  if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fullExtension as any)) {
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

  // Verifica se o tipo MIME é válido
  const validMimeTypes = Object.keys(VALID_MIME_TYPES);
  if (!validMimeTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Tipo de arquivo não suportado',
      errorType: 'error'
    };
  }

  // Verifica se a extensão corresponde ao tipo MIME
  const expectedExtensions = VALID_MIME_TYPES[file.type as keyof typeof VALID_MIME_TYPES];
  if (expectedExtensions) {
    const isValidExtension = expectedExtensions.some(ext => ext === fullExtension);
    if (!isValidExtension) {
      return { 
        isValid: false, 
        error: 'Extensão do arquivo não corresponde ao tipo de arquivo',
        errorType: 'error'
      };
    }
  }

  // Valida assinatura do arquivo (magic numbers)
  const isValidSignature = await validateFileSignature(file, file.type);
  if (!isValidSignature) {
    return { 
      isValid: false, 
      error: 'Arquivo corrompido ou tipo de arquivo inválido',
      errorType: 'error'
    };
  }

  // Sanitiza nome do arquivo
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  if (sanitizedName !== file.name) {
    return { 
      isValid: false, 
      error: 'Nome do arquivo contém caracteres inválidos',
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

// Funções createAnalysisPrompt e processAnalysisResponse agora estão em @/lib/analysis-utils

export async function POST(request: NextRequest) {
  try {
    // Verifica rate limiting
    const clientIP = getClientIP(request);
    const rateLimitInfo = checkRateLimit(clientIP, 'upload');
    
    if (!rateLimitInfo.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Muitas requisições. Tente novamente em alguns minutos.',
          error_type: 'warning',
          overall_assessment: "Rate limit excedido",
          user_context: "Rate limit excedido",
          recommendations: []
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitInfo.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

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
    const validation = await validateFile(file);
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
    
    // Gera hash do arquivo para cache
    const fileHash = await generateFileHash(file);
    const cacheKey = cache.generateKey(CACHE_CONFIG.uploadAnalysis.prefix, {
      fileHash,
      productContext: productContext || 'default'
    });

    // Tenta obter do cache primeiro
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        from_cache: true,
        cache_timestamp: (cachedResult as any).analysis_timestamp || Date.now()
      });
    }

    // Detecta idioma do usuário
    const acceptLanguage = request.headers.get('accept-language');
    const userLanguage = detectUserLanguage(acceptLanguage);
    
    // Cria prompt de análise
    const prompt = createAnalysisPrompt(productContext, userLanguage);
    
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

    // Análise concluída com sucesso

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
      analysis_timestamp: Date.now(),
      from_cache: false
    };

    // Armazena no cache
    cache.set(cacheKey, formattedResult, CACHE_CONFIG.uploadAnalysis.ttl);

    return NextResponse.json(formattedResult);

  } catch (error) {
    // Log do erro apenas no servidor (não expor para o cliente)
    console.error('Erro interno na análise de upload:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Mensagens de erro genéricas para o cliente
    let errorMessage = 'Ocorreu um erro interno durante a análise.';
    let errorType = 'error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      
      if (message.includes('api key') || message.includes('openai')) {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
        errorType = 'error';
        statusCode = 503;
      } else if (message.includes('quota') || message.includes('rate limit')) {
        errorMessage = 'Serviço temporariamente indisponível devido ao alto volume. Tente novamente em alguns minutos.';
        errorType = 'warning';
        statusCode = 429;
      } else if (message.includes('timeout') || message.includes('timeout')) {
        errorMessage = 'A análise demorou mais que o esperado. Tente novamente.';
        errorType = 'warning';
        statusCode = 408;
      } else if (message.includes('network') || message.includes('fetch')) {
        errorMessage = 'Erro de conectividade. Verifique sua conexão e tente novamente.';
        errorType = 'error';
        statusCode = 503;
      } else if (message.includes('validation') || message.includes('invalid')) {
        errorMessage = 'Dados fornecidos são inválidos. Verifique o arquivo e tente novamente.';
        errorType = 'error';
        statusCode = 400;
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
      { status: statusCode }
    );
  }
}
