// Sistema de cache simples em memória para APIs
// Em produção, considere usar Redis ou outro sistema distribuído

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Limpa entradas expiradas a cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp + entry.ttl < now) {
        this.cache.delete(key);
      }
    }
  }

  // Gera chave de cache baseada em parâmetros
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${Buffer.from(sortedParams).toString('base64')}`;
  }

  // Obtém dados do cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (entry.timestamp + entry.ttl < now) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Armazena dados no cache
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Remove entrada do cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Limpa todo o cache
  clear(): void {
    this.cache.clear();
  }

  // Obtém estatísticas do cache
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Instância global do cache
const cache = new MemoryCache();

// Configurações de cache por tipo de operação
export const CACHE_CONFIG = {
  // Cache de análise de URL por 1 hora (URLs não mudam frequentemente)
  urlAnalysis: {
    ttl: 60 * 60 * 1000, // 1 hora
    prefix: 'url_analysis'
  },
  // Cache de validação de URL por 30 minutos
  urlValidation: {
    ttl: 30 * 60 * 1000, // 30 minutos
    prefix: 'url_validation'
  },
  // Cache de análise de upload por 2 horas (imagens podem ser reanalisadas)
  uploadAnalysis: {
    ttl: 2 * 60 * 60 * 1000, // 2 horas
    prefix: 'upload_analysis'
  }
};

// Função para gerar hash de arquivo (para cache de uploads)
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Função para gerar hash de URL (para cache de URLs)
export function generateUrlHash(url: string): string {
  return Buffer.from(url).toString('base64');
}

// Wrapper para operações com cache
export async function withCache<T>(
  key: string,
  operation: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  // Tenta obter do cache primeiro
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Executa a operação
  const result = await operation();
  
  // Armazena no cache
  cache.set(key, result, ttl);
  
  return result;
}

// Função para invalidar cache por padrão
export function invalidateCache(pattern: string): void {
  const stats = cache.getStats();
  const keysToDelete = stats.keys.filter(key => key.includes(pattern));
  keysToDelete.forEach(key => cache.delete(key));
}

// Cleanup quando o processo termina
process.on('SIGTERM', () => {
  cache.destroy();
});

process.on('SIGINT', () => {
  cache.destroy();
});

export default cache;
