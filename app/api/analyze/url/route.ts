import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { getClientIP, checkRateLimit } from '@/lib/rate-limit';
import { generateUrlHash, CACHE_CONFIG } from '@/lib/cache';
import { createAnalysisPrompt, processAnalysisResponse } from '@/lib/analysis-utils';
import cache from '@/lib/cache';

// Inicializa cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configurações
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Função para verificar se é URL de imagem direta
function isDirectImageUrl(url: string): boolean {
  try {
    const urlLower = url.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    return imageExtensions.some(ext => urlLower.endsWith(ext));
  } catch {
    return false;
  }
}

// Whitelist de domínios permitidos para análise
const ALLOWED_DOMAINS = [
  'github.com',
  'github.io',
  'vercel.app',
  'netlify.app',
  'herokuapp.com',
  'amazonaws.com',
  'google.com',
  'microsoft.com',
  'apple.com',
  'figma.com',
  'dribbble.com',
  'behance.net',
  'medium.com',
  'dev.to',
  'stackoverflow.com',
  'codepen.io',
  'jsfiddle.net',
  'codepen.io',
  'repl.it',
  'codesandbox.io'
];

// Função para verificar se é URL válida e segura
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Apenas HTTP e HTTPS são permitidos
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // URLs bloqueadas por segurança
    const blockedPatterns = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      'file:',
      'ftp:',
      'data:',
      'javascript:',
      'vbscript:',
      'mailto:',
      'tel:',
      'sms:',
      '192.168.',
      '10.',
      '172.16.',
      '172.17.',
      '172.18.',
      '172.19.',
      '172.20.',
      '172.21.',
      '172.22.',
      '172.23.',
      '172.24.',
      '172.25.',
      '172.26.',
      '172.27.',
      '172.28.',
      '172.29.',
      '172.30.',
      '172.31.'
    ];
    
    const urlLower = url.toLowerCase();
    if (blockedPatterns.some(pattern => urlLower.includes(pattern))) {
      return false;
    }
    
    // Verificar se o domínio está na whitelist (opcional - pode ser removido para permitir qualquer domínio público)
    const hostname = urlObj.hostname.toLowerCase();
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
    
    // Se não estiver na whitelist, ainda permitir se for um domínio público válido
    if (!isAllowedDomain) {
      // Verificar se é um domínio público válido (não IP privado)
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipRegex.test(hostname)) {
        return false; // Bloquear IPs diretos
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

// Função para capturar imagem de URL
async function captureImageFromUrl(url: string): Promise<{ success: boolean; data?: ArrayBuffer; error?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return { success: false, error: `Erro ao acessar URL: ${response.status}` };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return { success: false, error: 'URL não retorna uma imagem válida' };
    }

    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
      return { success: false, error: `Imagem muito grande. Máximo permitido: ${MAX_FILE_SIZE / (1024 * 1024)}MB` };
    }

    return { success: true, data: arrayBuffer };
  } catch (error) {
    return { success: false, error: `Erro ao capturar imagem: ${error}` };
  }
}

// Função para capturar screenshot de página web usando Puppeteer
async function captureWebsiteScreenshot(url: string): Promise<{ success: boolean; data?: ArrayBuffer; error?: string }> {
  let browser;
  
  try {
    // Iniciando captura de screenshot
    
    // Detecta o ambiente
    const isVercel = process.env.VERCEL === '1';
    const isLocal = process.env.NODE_ENV === 'development';
    
    // Configuração segura do Puppeteer
    const puppeteerOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--single-process',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--disable-javascript',
        '--disable-plugins-discovery',
        '--disable-preconnect',
        '--disable-background-networking',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-pings',
        '--no-zygote',
        '--disable-ipc-flooding-protection',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--disable-domain-reliability',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-features=VizDisplayCompositor',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox'
      ],
      timeout: 30000, // 30 segundos de timeout
      protocolTimeout: 30000
    };

    if (isVercel) {
      // No Vercel, usa o @sparticuz/chromium
      // Configurando para ambiente Vercel
      puppeteerOptions.executablePath = await chromium.executablePath();
      puppeteerOptions.args = [...puppeteerOptions.args, ...chromium.args];
    } else if (isLocal) {
      // Em desenvolvimento local, usa o Chrome do sistema
      // Configurando para ambiente local
      puppeteerOptions.executablePath = process.platform === 'darwin' 
        ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        : process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : '/usr/bin/google-chrome';
    } else {
      return { 
        success: false, 
        error: 'Ambiente não suportado para captura de screenshots' 
      };
    }

    browser = await puppeteer.launch(puppeteerOptions);

    const page = await browser.newPage();
    
    // Configura viewport para desktop
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Configura user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Validação adicional de URL antes de navegar
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Protocolo não suportado');
      }
    } catch (error) {
      return { success: false, error: 'URL inválida fornecida' };
    }

    // Navega para a página com timeout de 30 segundos
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    // Aguarda um pouco para o conteúdo carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Captura screenshot em formato PNG
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: true
    });
    
    // Converte para ArrayBuffer
    const arrayBuffer = screenshotBuffer.buffer.slice(
      screenshotBuffer.byteOffset,
      screenshotBuffer.byteOffset + screenshotBuffer.byteLength
    );
    
    // Verifica tamanho da imagem
    if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
      return { success: false, error: `Screenshot muito grande. Máximo permitido: ${MAX_FILE_SIZE / (1024 * 1024)}MB` };
    }
    
    // Screenshot capturado com sucesso
    return { success: true, data: arrayBuffer };
    
  } catch (error) {
    console.error('❌ Erro ao capturar screenshot:', error);
    return { success: false, error: `Erro ao capturar screenshot: ${error}` };
  } finally {
    if (browser) {
      try {
        await browser.close();
        // Browser fechado
      } catch (error) {
        console.error('Erro ao fechar browser:', error);
      }
    }
  }
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
    // Verifica rate limiting
    const clientIP = getClientIP(request);
    const rateLimitInfo = checkRateLimit(clientIP, 'url');
    
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
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitInfo.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const body = await request.json();
    const { url, product_context: productContext = '' } = body;

    // Valida URL
    if (!url) {
      return NextResponse.json(
        { 
          success: false, 
          error: "URL é obrigatória",
          overall_assessment: "Erro na validação",
          user_context: "Erro na validação",
          recommendations: []
        },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "URL inválida ou não suportada",
          overall_assessment: "Erro na validação",
          user_context: "Erro na validação",
          recommendations: []
        },
        { status: 400 }
      );
    }

    // Determina se é URL de imagem direta ou página web
    let imageData: ArrayBuffer;
    let isWebPage = false;

    if (isDirectImageUrl(url)) {
      // Captura imagem diretamente da URL
      const result = await captureImageFromUrl(url);
      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: result.error,
            overall_assessment: "Erro na captura",
            user_context: "Erro na captura",
            recommendations: []
          },
          { status: 400 }
        );
      }
      imageData = result.data!;
    } else {
      // Captura screenshot da página web usando Puppeteer (apenas no Vercel)
      const result = await captureWebsiteScreenshot(url);
      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: result.error,
            overall_assessment: "Erro na captura",
            user_context: "Erro na captura",
            recommendations: []
          },
          { status: 400 }
        );
      }
      imageData = result.data!;
      isWebPage = true;
    }

    // Converte para base64
    const base64 = Buffer.from(imageData).toString('base64');
    
    // Gera hash da URL para cache
    const urlHash = generateUrlHash(url);
    const cacheKey = cache.generateKey(CACHE_CONFIG.urlAnalysis.prefix, {
      urlHash,
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

    // Cria prompt de análise
    const prompt = createAnalysisPrompt(productContext);
    
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
      format: "image/png",
      size: imageData.byteLength,
      width: 0, // Seria necessário processar a imagem para obter dimensões
      height: 0,
      file_size: imageData.byteLength
    };

    // Formata resposta final
    const formattedResult: any = {
      success: true,
      overall_assessment: analysisResult.overall_assessment || "Análise concluída",
      user_context: analysisResult.user_context || productContext || "Contexto não especificado",
      recommendations: analysisResult.recommendations || [],
      image_info: imageInfo,
      source_url: url,
      analysis_timestamp: Date.now(),
      from_cache: false
    };

    // Para páginas web, adiciona screenshot como base64
    if (isWebPage) {
      formattedResult.screenshot_data = `data:image/png;base64,${base64}`;
    }

    // Armazena no cache
    cache.set(cacheKey, formattedResult, CACHE_CONFIG.urlAnalysis.ttl);

    return NextResponse.json(formattedResult);

  } catch (error) {
    // Log do erro apenas no servidor (não expor para o cliente)
    console.error('Erro interno na análise de URL:', {
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
        errorMessage = 'URL fornecida é inválida ou não acessível. Verifique e tente novamente.';
        errorType = 'error';
        statusCode = 400;
      } else if (message.includes('puppeteer') || message.includes('browser')) {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
        errorType = 'error';
        statusCode = 503;
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
