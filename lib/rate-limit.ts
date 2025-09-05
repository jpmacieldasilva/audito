// Rate limiting simples em memória
// Em produção, considere usar Redis ou outro sistema distribuído

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Limpa entradas expiradas a cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (entry.resetTime < now) {
        this.requests.delete(key);
      }
    }
  }

  // Verifica se o IP pode fazer uma requisição
  isAllowed(ip: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const key = ip;
    
    const entry = this.requests.get(key);
    
    if (!entry || entry.resetTime < now) {
      // Primeira requisição ou janela expirada
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (entry.count >= limit) {
      return false;
    }
    
    // Incrementa contador
    entry.count++;
    return true;
  }

  // Obtém informações sobre o rate limit
  getInfo(ip: string, limit: number, windowMs: number): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const key = ip;
    const entry = this.requests.get(key);
    
    if (!entry || entry.resetTime < now) {
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs
      };
    }
    
    return {
      allowed: entry.count < limit,
      remaining: Math.max(0, limit - entry.count),
      resetTime: entry.resetTime
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Instância global do rate limiter
const rateLimiter = new RateLimiter();

// Configurações de rate limiting por endpoint
export const RATE_LIMITS = {
  upload: {
    limit: 10, // 10 requisições
    window: 60 * 1000, // por minuto
  },
  url: {
    limit: 5, // 5 requisições
    window: 60 * 1000, // por minuto
  },
  health: {
    limit: 100, // 100 requisições
    window: 60 * 1000, // por minuto
  }
};

// Função para obter IP do cliente
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

// Função para verificar rate limit
export function checkRateLimit(
  ip: string, 
  endpoint: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMITS[endpoint];
  const info = rateLimiter.getInfo(ip, config.limit, config.window);
  
  return {
    allowed: info.allowed,
    remaining: info.remaining,
    resetTime: info.resetTime
  };
}

// Função para aplicar rate limit
export function applyRateLimit(
  ip: string, 
  endpoint: keyof typeof RATE_LIMITS
): boolean {
  const config = RATE_LIMITS[endpoint];
  return rateLimiter.isAllowed(ip, config.limit, config.window);
}

// Cleanup quando o processo termina
process.on('SIGTERM', () => {
  rateLimiter.destroy();
});

process.on('SIGINT', () => {
  rateLimiter.destroy();
});
