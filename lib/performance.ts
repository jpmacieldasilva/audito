// Sistema de monitoramento de performance
// Coleta métricas de performance da aplicação

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'counter' | 'gauge';
  tags?: Record<string, string>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observer para métricas de navegação
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              this.recordMetric('page_load_time', entry.duration, 'timing');
              this.recordMetric('dom_content_loaded', (entry as any).domContentLoadedEventEnd - (entry as any).domContentLoadedEventStart, 'timing');
              this.recordMetric('first_paint', (entry as any).loadEventEnd - (entry as any).loadEventStart, 'timing');
            }
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }

      // Observer para métricas de recursos
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              const resource = entry as PerformanceResourceTiming;
              this.recordMetric('resource_load_time', resource.duration, 'timing', {
                resource_type: resource.initiatorType,
                resource_name: resource.name.split('/').pop() || 'unknown'
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource Performance Observer not supported:', error);
      }

      // Observer para métricas de layout
      try {
        const layoutObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift') {
              const clsEntry = entry as any;
              if (!clsEntry.hadRecentInput) {
                this.recordMetric('cumulative_layout_shift', clsEntry.value, 'gauge');
              }
            }
          }
        });
        layoutObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutObserver);
      } catch (error) {
        console.warn('Layout Shift Performance Observer not supported:', error);
      }
    }
  }

  // Registra uma métrica personalizada
  recordMetric(name: string, value: number, type: 'timing' | 'counter' | 'gauge', tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type,
      tags
    };

    this.metrics.push(metric);

    // Limita o número de métricas em memória
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }

    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value}ms`, tags);
    }
  }

  // Obtém métricas por nome
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return [...this.metrics];
  }

  // Obtém estatísticas de uma métrica
  getMetricStats(name: string) {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return null;

    const values = metrics.map(m => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      sum,
      average: avg,
      min,
      max,
      latest: values[values.length - 1]
    };
  }

  // Obtém métricas de performance da página atual
  getPageMetrics() {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    return {
      // Tempos de carregamento
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstByte: navigation.responseStart - navigation.requestStart,
      
      // Tamanhos
      transferSize: navigation.transferSize,
      encodedBodySize: navigation.encodedBodySize,
      decodedBodySize: navigation.decodedBodySize,
      
      // DNS e conexão
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcpConnect: navigation.connectEnd - navigation.connectStart,
      
      // Renderização
      domProcessing: navigation.domComplete - (navigation as any).domLoading,
      domInteractive: navigation.domInteractive - (navigation as any).navigationStart
    };
  }

  // Obtém Core Web Vitals
  getCoreWebVitals() {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    // First Contentful Paint (FCP)
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    const fcp = fcpEntry ? fcpEntry.startTime : null;

    // Largest Contentful Paint (LCP)
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : null;

    // First Input Delay (FID) - seria necessário observer específico
    const fid = null; // Implementar com observer específico se necessário

    // Cumulative Layout Shift (CLS)
    const clsEntries = performance.getEntriesByType('layout-shift');
    const cls = clsEntries.reduce((sum, entry: any) => {
      return entry.hadRecentInput ? sum : sum + entry.value;
    }, 0);

    return {
      fcp,
      lcp,
      fid,
      cls,
      ttfb: navigation.responseStart - navigation.requestStart
    };
  }

  // Envia métricas para serviço de monitoramento (exemplo)
  async sendMetrics(endpoint?: string) {
    if (!endpoint) return;

    try {
      const payload = {
        timestamp: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        metrics: this.metrics,
        pageMetrics: this.getPageMetrics(),
        coreWebVitals: this.getCoreWebVitals()
      };

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Limpa métricas após envio
      this.metrics = [];
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
    }
  }

  // Mede tempo de execução assíncrono
  async measureTimeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    
    this.recordMetric(name, end - start, 'timing');
    return result;
  }

  // Limpa observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Instância global do monitor
const performanceMonitor = new PerformanceMonitor();

// Função para medir tempo de execução
function measureTime<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  performanceMonitor.recordMetric(name, end - start, 'timing');
  return result;
}

// Função para medir tempo de execução assíncrono
async function measureTimeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  performanceMonitor.recordMetric(name, end - start, 'timing');
  return result;
}

// Exporta as funções utilitárias
export { measureTime, measureTimeAsync };

// Hook para React (se necessário)
export function usePerformanceMonitor() {
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getMetricStats: performanceMonitor.getMetricStats.bind(performanceMonitor),
    getPageMetrics: performanceMonitor.getPageMetrics.bind(performanceMonitor),
    getCoreWebVitals: performanceMonitor.getCoreWebVitals.bind(performanceMonitor)
  };
}

export default performanceMonitor;
