from fastapi import FastAPI, Request, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import json
from typing import Optional

# Criação da aplicação FastAPI
app = FastAPI(
    title="Audito Backend",
    version="1.0.0",
    description="Backend para análise de usabilidade e acessibilidade de interfaces usando IA"
)

# Configuração de CORS para produção
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos os origens
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "X-Process-Time"],
    max_age=600,
)

# Rota raiz
@app.get("/")
async def root():
    return {
        "message": "🚀 Audito Backend - API de Análise de Interfaces",
        "version": "1.0.0",
        "status": "OK",
        "timestamp": time.time(),
        "endpoints": {
            "analyze_upload": "/api/analyze/upload",
            "analyze_url": "/api/analyze/url",
            "health": "/api/health"
        }
    }

# Rota de health check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "audito-backend",
        "version": "1.0.0"
    }

# Rota de análise de upload (simulada)
@app.post("/api/analyze/upload")
async def analyze_upload(
    file: UploadFile = File(...),
    product_context: Optional[str] = Form(None)
):
    try:
        # Simulação de análise
        await file.read()  # Lê o arquivo para simular processamento
        
        # Resposta simulada
        return {
            "success": True,
            "overall_assessment": "Interface bem estruturada com algumas oportunidades de melhoria.",
            "user_context": product_context or "Análise geral de interface",
            "recommendations": [
                {
                    "id": "1",
                    "title": "Melhorar contraste de cores",
                    "problem": "Alguns elementos têm contraste insuficiente",
                    "impact": "Pode dificultar a leitura para usuários com deficiências visuais",
                    "suggestion": "Aumentar o contraste entre texto e fundo para pelo menos 4.5:1",
                    "category": "Acessibilidade"
                },
                {
                    "id": "2", 
                    "title": "Otimizar navegação",
                    "problem": "Menu principal pode ser mais intuitivo",
                    "impact": "Usuários podem ter dificuldade para encontrar funcionalidades",
                    "suggestion": "Reorganizar itens do menu por frequência de uso",
                    "category": "Usabilidade"
                }
            ],
            "analysis_timestamp": time.time()
        }
        
    except Exception as e:
        print(f"Erro na análise de upload: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar arquivo: {str(e)}")

# Rota de análise de URL (simulada)
@app.post("/api/analyze/url")
async def analyze_url(request: Request):
    try:
        body = await request.json()
        url = body.get("url")
        product_context = body.get("product_context")
        
        if not url:
            raise HTTPException(status_code=400, detail="URL é obrigatória")
        
        # Simulação de captura de screenshot e análise
        screenshot_data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        return {
            "success": True,
            "overall_assessment": "Website com boa estrutura base, mas com pontos de melhoria identificados.",
            "user_context": product_context or "Análise de website",
            "screenshot_data": screenshot_data,
            "source_url": url,
            "recommendations": [
                {
                    "id": "1",
                    "title": "Melhorar responsividade mobile",
                    "problem": "Layout não se adapta bem a telas pequenas",
                    "impact": "Experiência ruim em dispositivos móveis",
                    "suggestion": "Implementar design responsivo com breakpoints adequados",
                    "category": "Responsividade"
                },
                {
                    "id": "2",
                    "title": "Otimizar tempo de carregamento",
                    "problem": "Página carrega lentamente",
                    "impact": "Usuários podem abandonar antes do carregamento completo",
                    "suggestion": "Otimizar imagens e implementar lazy loading",
                    "category": "Performance"
                },
                {
                    "id": "3",
                    "title": "Melhorar acessibilidade de formulários",
                    "problem": "Campos sem labels apropriados",
                    "impact": "Leitores de tela não conseguem interpretar os campos",
                    "suggestion": "Adicionar labels descritivos para todos os campos",
                    "category": "Acessibilidade"
                }
            ],
            "analysis_timestamp": time.time()
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="JSON inválido")
    except Exception as e:
        print(f"Erro na análise de URL: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar URL: {str(e)}")

# Handler para Vercel
def handler(request, context):
    """Handler para Vercel serverless functions"""
    return app(request, context)
