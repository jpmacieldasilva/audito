from typing import Dict, Any, Tuple
import asyncio
from .image_service import ImageService
from ..core.agno_client import AgnoClient

class AnalysisService:
    """Serviço principal de análise de interfaces"""
    
    def __init__(self):
        """Inicializa o serviço de análise"""
        self.image_service = ImageService()
        self.agno_client = AgnoClient()
    
    def analyze_uploaded_image(self, file_content: bytes, filename: str, product_context: str = "") -> Tuple[bool, Dict[str, Any], str]:
        """
        Analisa imagem enviada via upload
        
        Args:
            file_content: Conteúdo do arquivo em bytes
            filename: Nome do arquivo
            product_context: Contexto opcional do produto
            
        Returns:
            Tuple (sucesso, resultado_análise, mensagem_erro)
        """
        try:
            # Valida arquivo
            is_valid, error_msg = self.image_service.validate_uploaded_file(file_content, filename)
            if not is_valid:
                return False, {}, error_msg
            
            # Otimiza imagem
            optimized_image = self.image_service.optimize_image(file_content)
            
            # Executa análise com Agno (sem await)
            analysis_result = self.agno_client.analyze_image(optimized_image, product_context)
            
            # Adiciona informações da imagem ao resultado
            image_info = self.image_service.get_image_info(file_content)
            analysis_result["image_info"] = image_info
            
            return True, analysis_result, ""
            
        except Exception as e:
            error_msg = f"Erro na análise da imagem: {str(e)}"
            print(f"❌ {error_msg}")
            return False, {}, error_msg
    
    async def analyze_image_from_url_async(self, url: str, product_context: str = "") -> Tuple[bool, Dict[str, Any], str]:
        """
        Analisa imagem capturada de uma URL (imagem direta ou screenshot de página) - versão assíncrona
        
        Args:
            url: URL da imagem ou página web
            product_context: Contexto opcional do produto
            
        Returns:
            Tuple (sucesso, resultado_análise, mensagem_erro)
        """
        try:
            # Determina se é uma URL de imagem direta ou página web
            if self._is_direct_image_url(url):
                # Captura imagem diretamente da URL
                success, image_data, error_msg = self.image_service.capture_image_from_url(url)
                if not success:
                    return False, {}, error_msg
            else:
                # Captura screenshot da página web
                success, image_data, error_msg = await self.image_service.capture_website_screenshot(url)
                if not success:
                    return False, {}, error_msg
            
            # Otimiza imagem
            optimized_image = self.image_service.optimize_image(image_data)
            
            # Executa análise com Agno (sem await)
            analysis_result = self.agno_client.analyze_image(optimized_image, product_context)
            
            # Adiciona informações da imagem ao resultado
            image_info = self.image_service.get_image_info(image_data)
            analysis_result["image_info"] = image_info
            analysis_result["source_url"] = url
            
            # Para páginas web (screenshots), adiciona a imagem como base64
            if not self._is_direct_image_url(url):
                import base64
                image_b64 = base64.b64encode(image_data).decode('utf-8')
                analysis_result["screenshot_data"] = f"data:image/png;base64,{image_b64}"
            
            return True, analysis_result, ""
            
        except Exception as e:
            error_msg = f"Erro na análise da URL: {str(e)}"
            print(f"❌ {error_msg}")
            return False, {}, error_msg

    def analyze_image_from_url(self, url: str, product_context: str = "") -> Tuple[bool, Dict[str, Any], str]:
        """
        Analisa imagem capturada de uma URL (imagem direta ou screenshot de página) - versão síncrona para compatibilidade
        
        Args:
            url: URL da imagem ou página web
            product_context: Contexto opcional do produto
            
        Returns:
            Tuple (sucesso, resultado_análise, mensagem_erro)
        """
        try:
            # Determina se é uma URL de imagem direta ou página web
            if self._is_direct_image_url(url):
                # Captura imagem diretamente da URL
                success, image_data, error_msg = self.image_service.capture_image_from_url(url)
                if not success:
                    return False, {}, error_msg
                
                # Otimiza imagem
                optimized_image = self.image_service.optimize_image(image_data)
                
                # Executa análise com Agno
                analysis_result = self.agno_client.analyze_image(optimized_image, product_context)
                
                # Adiciona informações da imagem ao resultado
                image_info = self.image_service.get_image_info(image_data)
                analysis_result["image_info"] = image_info
                analysis_result["source_url"] = url
                
                return True, analysis_result, ""
            else:
                # Para páginas web, retorna erro indicando que deve usar a versão assíncrona
                return False, {}, "Para páginas web, use analyze_image_from_url_async()"
            
        except Exception as e:
            error_msg = f"Erro na análise da URL: {str(e)}"
            print(f"❌ {error_msg}")
            return False, {}, error_msg
    
    def _is_direct_image_url(self, url: str) -> bool:
        """
        Verifica se a URL aponta diretamente para uma imagem
        
        Args:
            url: URL para verificar
            
        Returns:
            True se for uma URL de imagem direta
        """
        try:
            url_lower = url.lower()
            # Extensões de imagem comuns
            image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
            return any(url_lower.endswith(ext) for ext in image_extensions)
        except Exception:
            return False
    
    def format_analysis_response(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Formata resultado da análise para resposta da API
        
        Args:
            analysis_result: Resultado bruto da análise
            
        Returns:
            Resultado formatado
        """
        try:
            # Garante que o resultado tenha a estrutura esperada
            formatted_result = {
                "success": True,
                "overall_assessment": analysis_result.get("overall_assessment", "Análise concluída"),
                "user_context": analysis_result.get("user_context", "Contexto não especificado"),
                "recommendations": analysis_result.get("recommendations", []),
                "image_info": analysis_result.get("image_info", {}),
                "source_url": analysis_result.get("source_url", None),
                "screenshot_data": analysis_result.get("screenshot_data", None),
                "analysis_timestamp": analysis_result.get("timestamp", None)
            }
            
            # Valida e limpa recomendações
            if formatted_result["recommendations"]:
                cleaned_recommendations = []
                for rec in formatted_result["recommendations"]:
                    if isinstance(rec, dict):
                        cleaned_rec = {
                            "id": str(rec.get("id", "")),
                            "title": str(rec.get("title", "")),
                            "problem": str(rec.get("problem", "")),
                            "impact": str(rec.get("impact", "")),
                            "suggestion": str(rec.get("suggestion", "")),
                            "category": str(rec.get("category", "Usabilidade"))
                        }
                        cleaned_recommendations.append(cleaned_rec)
                
                formatted_result["recommendations"] = cleaned_recommendations
            
            return formatted_result
            
        except Exception as e:
            print(f"⚠️  Erro ao formatar resposta: {e}")
            return {
                "success": False,
                "error": "Erro ao formatar resultado da análise",
                "overall_assessment": "Erro na formatação",
                "user_context": "Erro na formatação",
                "recommendations": []
            }
    
    def create_error_response(self, error_message: str) -> Dict[str, Any]:
        """Cria resposta de erro padronizada"""
        return {
            "success": False,
            "error": error_message,
            "overall_assessment": "Erro na análise",
            "user_context": "Erro na análise",
            "recommendations": [],
            "image_info": {},
            "source_url": None,
            "screenshot_data": None
        }
