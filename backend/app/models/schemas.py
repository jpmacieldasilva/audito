from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional
from datetime import datetime

class ImageUploadRequest:
    """Request para upload de imagem"""
    file: bytes
    product_context: Optional[str] = ""

class ImageUrlRequest(BaseModel):
    """Request para análise de imagem via URL"""
    url: HttpUrl = Field(..., description="URL da imagem para análise")
    product_context: Optional[str] = Field("", description="Contexto opcional do produto")

class WebsiteScreenshotRequest(BaseModel):
    """Request para captura de screenshot de página web"""
    url: HttpUrl = Field(..., description="URL da página web para capturar screenshot")
    product_context: Optional[str] = Field("", description="Contexto opcional do produto")

class Recommendation(BaseModel):
    """Modelo para recomendação de melhoria"""
    id: str = Field(..., description="ID único da recomendação")
    title: str = Field(..., description="Título da recomendação")
    problem: str = Field(..., description="Descrição objetiva do problema de design ou usabilidade")
    impact: str = Field(..., description="Explicação do impacto negativo para o usuário")
    suggestion: str = Field(..., description="Solução concreta e acionável para resolver o problema")
    category: str = Field(..., description="Categoria da recomendação: Usabilidade, Acessibilidade, Visual, Navegação, Hierarquia")

class ImageInfo(BaseModel):
    """Informações da imagem analisada"""
    format: Optional[str] = None
    mode: Optional[str] = None
    size: Optional[tuple] = None
    width: Optional[int] = None
    height: Optional[int] = None
    file_size: Optional[int] = None

class AnalysisResponse(BaseModel):
    """Resposta da análise de interface"""
    success: bool = Field(..., description="Indica se a análise foi bem-sucedida")
    overall_assessment: str = Field(..., description="Avaliação geral da interface")
    user_context: str = Field(..., description="Contexto do usuário e objetivo principal")
    recommendations: List[Recommendation] = Field(..., description="Lista de recomendações de melhoria")
    image_info: Optional[ImageInfo] = Field(None, description="Informações da imagem analisada")
    source_url: Optional[str] = Field(None, description="URL de origem da imagem (se aplicável)")
    screenshot_data: Optional[str] = Field(None, description="Screenshot capturado em base64 (para páginas web)")
    analysis_timestamp: Optional[float] = Field(None, description="Timestamp da análise")
    error: Optional[str] = Field(None, description="Mensagem de erro (se houver)")

class ErrorResponse(BaseModel):
    """Resposta de erro padronizada"""
    success: bool = False
    error: str = Field(..., description="Descrição do erro")
    overall_assessment: str = "Erro na análise"
    user_context: str = "Erro na análise"
    recommendations: List[Recommendation] = []
    image_info: Optional[ImageInfo] = None
    source_url: Optional[str] = None
    analysis_timestamp: Optional[float] = None

class HealthResponse(BaseModel):
    """Resposta do health check"""
    status: str = Field("healthy", description="Status do serviço")
    timestamp: datetime = Field(default_factory=datetime.now, description="Timestamp da verificação")
    version: str = Field("1.0.0", description="Versão da API")
    service: str = Field("Audito Backend", description="Nome do serviço")
