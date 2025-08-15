from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Optional
import time
from ..services.analysis_service import AnalysisService
from ..models.schemas import (
    ImageUploadRequest, 
    ImageUrlRequest, 
    WebsiteScreenshotRequest,
    AnalysisResponse, 
    HealthResponse,
    ErrorResponse
)

# Criação do router
router = APIRouter()

# Instância do serviço de análise
analysis_service = AnalysisService()

@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Endpoint de health check para monitoramento"""
    return HealthResponse(
        status="healthy",
        service="Audito Backend",
        version="1.0.0"
    )

@router.post("/analyze/upload", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_uploaded_image(
    file: UploadFile = File(..., description="Arquivo de imagem para análise"),
    product_context: Optional[str] = Form("", description="Contexto opcional do produto")
):
    """
    Analisa imagem enviada via upload
    
    - **file**: Arquivo de imagem (PNG, JPG, JPEG, máximo 5MB)
    - **product_context**: Contexto opcional do produto para análise
    """
    try:
        # Valida tipo de arquivo
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Arquivo deve ser uma imagem válida"
            )
        
        # Lê conteúdo do arquivo
        file_content = await file.read()
        
        # Executa análise (sem await, pois o serviço não é mais assíncrono)
        success, result, error_msg = analysis_service.analyze_uploaded_image(
            file_content, 
            file.filename, 
            product_context
        )
        
        if not success:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=analysis_service.create_error_response(error_msg)
            )
        
        # Formata resposta
        formatted_result = analysis_service.format_analysis_response(result)
        formatted_result["analysis_timestamp"] = time.time()
        
        return formatted_result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erro inesperado na análise de upload: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=analysis_service.create_error_response(f"Erro interno do servidor: {str(e)}")
        )

@router.post("/analyze/screenshot", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_website_screenshot(request: WebsiteScreenshotRequest):
    """
    Captura screenshot de uma página web e analisa a interface
    
    - **url**: URL da página web para capturar screenshot
    - **product_context**: Contexto opcional do produto para análise
    """
    try:
        # Executa análise (vai automaticamente detectar que não é imagem direta e fazer screenshot)
        success, result, error_msg = await analysis_service.analyze_image_from_url_async(
            str(request.url), 
            request.product_context
        )
        
        if not success:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=analysis_service.create_error_response(error_msg)
            )
        
        # Formata resposta
        formatted_result = analysis_service.format_analysis_response(result)
        formatted_result["analysis_timestamp"] = time.time()
        
        return formatted_result
        
    except Exception as e:
        print(f"❌ Erro inesperado na análise de screenshot: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=analysis_service.create_error_response(f"Erro interno do servidor: {str(e)}")
        )

@router.post("/analyze/url", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_image_from_url(request: ImageUrlRequest):
    """
    Analisa imagem capturada de uma URL
    
    - **url**: URL da imagem para análise
    - **product_context**: Contexto opcional do produto para análise
    """
    try:
        # Executa análise (usando versão assíncrona)
        success, result, error_msg = await analysis_service.analyze_image_from_url_async(
            str(request.url), 
            request.product_context
        )
        
        if not success:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=analysis_service.create_error_response(error_msg)
            )
        
        # Formata resposta
        formatted_result = analysis_service.format_analysis_response(result)
        formatted_result["analysis_timestamp"] = time.time()
        
        return formatted_result
        
    except Exception as e:
        print(f"❌ Erro inesperado na análise de URL: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=analysis_service.create_error_response(f"Erro interno do servidor: {str(e)}")
        )

@router.post("/analyze/screenshot", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_website_screenshot(request: WebsiteScreenshotRequest):
    """
    Captura screenshot de uma página web e analisa a interface
    
    - **url**: URL da página web para capturar screenshot
    - **product_context**: Contexto opcional do produto para análise
    """
    try:
        # Executa análise (vai automaticamente detectar que não é imagem direta e fazer screenshot)
        success, result, error_msg = await analysis_service.analyze_image_from_url_async(
            str(request.url), 
            request.product_context
        )
        
        if not success:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=analysis_service.create_error_response(error_msg)
            )
        
        # Formata resposta
        formatted_result = analysis_service.format_analysis_response(result)
        formatted_result["analysis_timestamp"] = time.time()
        
        return formatted_result
        
    except Exception as e:
        print(f"❌ Erro inesperado na análise de screenshot: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=analysis_service.create_error_response(f"Erro interno do servidor: {str(e)}")
        )

@router.post("/analyze", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_image(
    file: Optional[UploadFile] = File(None, description="Arquivo de imagem para análise"),
    url: Optional[str] = Form(None, description="URL da imagem para análise"),
    product_context: Optional[str] = Form("", description="Contexto opcional do produto")
):
    """
    Endpoint unificado para análise de imagem (upload ou URL)
    
    - **file**: Arquivo de imagem (PNG, JPG, JPEG, máximo 5MB)
    - **url**: URL da imagem para análise
    - **product_context**: Contexto opcional do produto para análise
    
    Forneça OU um arquivo OU uma URL, não ambos.
    """
    try:
        # Valida que apenas uma opção foi fornecida
        if file and url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Forneça apenas um arquivo OU uma URL, não ambos"
            )
        
        if not file and not url:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Forneça um arquivo OU uma URL para análise"
            )
        
        # Executa análise baseada no tipo de entrada
        if file:
            # Análise de arquivo enviado
            file_content = await file.read()
            success, result, error_msg = analysis_service.analyze_uploaded_image(
                file_content, 
                file.filename, 
                product_context
            )
        else:
            # Análise de URL
            success, result, error_msg = await analysis_service.analyze_image_from_url_async(
                url, 
                product_context
            )
        
        if not success:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=analysis_service.create_error_response(error_msg)
            )
        
        # Formata resposta
        formatted_result = analysis_service.format_analysis_response(result)
        formatted_result["analysis_timestamp"] = time.time()
        
        return formatted_result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erro inesperado na análise: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=analysis_service.create_error_response(f"Erro interno do servidor: {str(e)}")
        )

@router.post("/analyze/screenshot", response_model=AnalysisResponse, tags=["Analysis"])
async def analyze_website_screenshot(request: WebsiteScreenshotRequest):
    """
    Captura screenshot de uma página web e analisa a interface
    
    - **url**: URL da página web para capturar screenshot
    - **product_context**: Contexto opcional do produto para análise
    """
    try:
        # Executa análise (vai automaticamente detectar que não é imagem direta e fazer screenshot)
        success, result, error_msg = await analysis_service.analyze_image_from_url_async(
            str(request.url), 
            request.product_context
        )
        
        if not success:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content=analysis_service.create_error_response(error_msg)
            )
        
        # Formata resposta
        formatted_result = analysis_service.format_analysis_response(result)
        formatted_result["analysis_timestamp"] = time.time()
        
        return formatted_result
        
    except Exception as e:
        print(f"❌ Erro inesperado na análise de screenshot: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=analysis_service.create_error_response(f"Erro interno do servidor: {str(e)}")
        )
