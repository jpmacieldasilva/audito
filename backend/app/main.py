from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import traceback
from .core.config import settings
from .api.routes import router

# Criação da aplicação FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend para análise de usabilidade e acessibilidade de interfaces usando IA",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração de CORS mais robusta para permitir frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend Next.js
        "http://127.0.0.1:3000",  # Frontend alternativo
        "http://localhost:3001",   # Porta alternativa
        "http://127.0.0.1:3001",  # Porta alternativa
        "*"                        # Fallback para desenvolvimento
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=[
        "Content-Type", 
        "Authorization", 
        "Accept", 
        "Origin", 
        "X-Requested-With",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
    ],
    expose_headers=["Content-Type", "X-Process-Time"],
    max_age=600,  # Cache preflight por 10 minutos
)

# Middleware para logging de requisições
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Middleware para logging de requisições"""
    start_time = time.time()
    
    # Log da requisição
    print(f"📥 {request.method} {request.url.path}")
    print(f"   Origin: {request.headers.get('origin', 'N/A')}")
    print(f"   User-Agent: {request.headers.get('user-agent', 'N/A')}")
    
    # Processa requisição
    response = await call_next(request)
    
    # Calcula tempo de resposta
    process_time = time.time() - start_time
    
    # Log da resposta
    print(f"📤 {request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    
    # Adiciona header de tempo de processamento
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

# Middleware para tratamento global de erros
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handler global para exceções não tratadas"""
    print(f"❌ Erro não tratado: {exc}")
    print(f"📍 URL: {request.url}")
    print(f"🔍 Método: {request.method}")
    print(f"📋 Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Erro interno do servidor",
            "detail": "Ocorreu um erro inesperado. Tente novamente mais tarde.",
            "timestamp": time.time()
        }
    )

# Inclui rotas da API
app.include_router(router, prefix=settings.API_V1_STR)

# Rota raiz
@app.get("/", tags=["Root"])
async def root():
    """Rota raiz da API"""
    return {
        "message": "🚀 Audito Backend - API de Análise de Interfaces",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "endpoints": {
            "analyze": f"{settings.API_V1_STR}/analyze",
            "analyze_upload": f"{settings.API_V1_STR}/analyze/upload",
            "analyze_url": f"{settings.API_V1_STR}/analyze/url"
        }
    }

# Evento de inicialização
@app.on_event("startup")
async def startup_event():
    """Evento executado na inicialização da aplicação"""
    print("🚀 Iniciando Audito Backend...")
    print(f"📊 Versão: {settings.VERSION}")
    print(f"🔑 OpenAI API Key: {'✅ Configurada' if settings.OPENAI_API_KEY else '❌ Não configurada'}")
    print(f"🌐 Servidor rodando em: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 Documentação: http://{settings.HOST}:{settings.PORT}/docs")
    print("✅ Backend iniciado com sucesso!")

# Evento de encerramento
@app.on_event("shutdown")
async def shutdown_event():
    """Evento executado no encerramento da aplicação"""
    print("🛑 Encerrando Audito Backend...")
    print("✅ Backend encerrado com sucesso!")

if __name__ == "__main__":
    import uvicorn
    
    print("🚀 Iniciando servidor de desenvolvimento...")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level="info"
    )
