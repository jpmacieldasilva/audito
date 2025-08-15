import os
import requests
from typing import Tuple, Optional
from PIL import Image
import io
import asyncio
from playwright.async_api import async_playwright
from ..core.config import settings

class ImageService:
    """Serviço para processamento de imagens"""
    
    def __init__(self):
        """Inicializa o serviço de imagens"""
        self.max_size = settings.MAX_FILE_SIZE
        self.allowed_extensions = settings.ALLOWED_EXTENSIONS
    
    def validate_uploaded_file(self, file_content: bytes, filename: str) -> Tuple[bool, str]:
        """
        Valida arquivo de imagem enviado
        
        Args:
            file_content: Conteúdo do arquivo em bytes
            filename: Nome do arquivo
            
        Returns:
            Tuple (é_válido, mensagem_erro)
        """
        try:
            # Verifica tamanho do arquivo
            if len(file_content) > self.max_size:
                return False, f"Arquivo muito grande. Máximo permitido: {self.max_size // (1024*1024)}MB"
            
            # Verifica extensão
            file_ext = os.path.splitext(filename)[1].lower()
            if file_ext not in self.allowed_extensions:
                return False, f"Formato não suportado. Use: {', '.join(self.allowed_extensions)}"
            
            # Verifica se é uma imagem válida
            try:
                image = Image.open(io.BytesIO(file_content))
                image.verify()
                return True, ""
            except Exception:
                return False, "Arquivo não é uma imagem válida"
                
        except Exception as e:
            return False, f"Erro na validação: {str(e)}"
    
    def capture_image_from_url(self, url: str) -> Tuple[bool, bytes, str]:
        """
        Captura imagem de uma URL
        
        Args:
            url: URL da imagem
            
        Returns:
            Tuple (sucesso, dados_imagem, mensagem_erro)
        """
        try:
            # Valida URL
            if not self._is_valid_image_url(url):
                return False, b"", "URL não aponta para uma imagem válida"
            
            # Faz requisição para a imagem
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            # Verifica se é uma imagem
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                return False, b"", "URL não retorna uma imagem válida"
            
            image_data = response.content
            
            # Valida tamanho da imagem
            if len(image_data) > self.max_size:
                return False, b"", f"Imagem muito grande. Máximo permitido: {self.max_size // (1024*1024)}MB"
            
            return True, image_data, ""
            
        except requests.exceptions.RequestException as e:
            return False, b"", f"Erro ao acessar URL: {str(e)}"
        except Exception as e:
            return False, b"", f"Erro inesperado: {str(e)}"
    
    def _is_valid_image_url(self, url: str) -> bool:
        """Verifica se a URL é válida para captura de imagem"""
        try:
            # Verifica se é uma URL válida
            if not url.startswith(('http://', 'https://')):
                return False
            
            # Verifica se termina com extensão de imagem
            url_lower = url.lower()
            return any(url_lower.endswith(ext) for ext in self.allowed_extensions)
            
        except Exception:
            return False
    
    def optimize_image(self, image_data: bytes) -> bytes:
        """
        Otimiza imagem para análise (reduz tamanho se necessário)
        
        Args:
            image_data: Dados da imagem em bytes
            
        Returns:
            Dados da imagem otimizada
        """
        try:
            # Abre imagem
            image = Image.open(io.BytesIO(image_data))
            
            # Converte para RGB se necessário
            if image.mode in ('RGBA', 'LA', 'P'):
                image = image.convert('RGB')
            
            # Redimensiona se muito grande (mantém proporção)
            max_dimension = 1200
            if max(image.size) > max_dimension:
                ratio = max_dimension / max(image.size)
                new_size = tuple(int(dim * ratio) for dim in image.size)
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            # Salva otimizada
            output = io.BytesIO()
            image.save(output, format='JPEG', quality=85, optimize=True)
            output.seek(0)
            
            return output.getvalue()
            
        except Exception as e:
            print(f"⚠️  Erro ao otimizar imagem: {e}")
            # Retorna imagem original se houver erro
            return image_data
    
    async def capture_website_screenshot(self, url: str) -> Tuple[bool, bytes, str]:
        """
        Captura screenshot de uma página web usando Playwright
        
        Args:
            url: URL da página web
            
        Returns:
            Tuple (sucesso, dados_imagem, mensagem_erro)
        """
        try:
            # Valida URL
            if not self._is_valid_web_url(url):
                return False, b"", "URL inválida ou não suportada"
            
            async with async_playwright() as p:
                # Configura navegador (headless por padrão)
                browser = await p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox', '--disable-dev-shm-usage']
                )
                
                try:
                    # Cria nova página
                    page = await browser.new_page()
                    
                    # Configura viewport para desktop
                    await page.set_viewport_size({"width": 1280, "height": 720})
                    
                    # Navega para a página com timeout de 30 segundos
                    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                    
                    # Aguarda um pouco para o conteúdo carregar
                    await page.wait_for_timeout(2000)
                    
                    # Captura screenshot em formato PNG
                    screenshot_bytes = await page.screenshot(
                        type="png",
                        full_page=False  # Apenas viewport visível
                    )
                    
                    # Verifica tamanho da imagem
                    if len(screenshot_bytes) > self.max_size:
                        return False, b"", f"Screenshot muito grande. Máximo permitido: {self.max_size // (1024*1024)}MB"
                    
                    return True, screenshot_bytes, ""
                    
                finally:
                    await browser.close()
                    
        except Exception as e:
            print(f"❌ Erro ao capturar screenshot: {e}")
            return False, b"", f"Erro ao capturar screenshot: {str(e)}"
    
    def _is_valid_web_url(self, url: str) -> bool:
        """Verifica se a URL é válida para captura de screenshot"""
        try:
            # Verifica se é uma URL válida
            if not url.startswith(('http://', 'https://')):
                return False
            
            # URLs básicas não permitidas
            blocked_patterns = [
                'localhost',
                '127.0.0.1',
                '0.0.0.0',
                'file://',
                'ftp://'
            ]
            
            url_lower = url.lower()
            for pattern in blocked_patterns:
                if pattern in url_lower:
                    return False
            
            return True
            
        except Exception:
            return False

    def get_image_info(self, image_data: bytes) -> dict:
        """
        Obtém informações básicas da imagem
        
        Args:
            image_data: Dados da imagem em bytes
            
        Returns:
            Dicionário com informações da imagem
        """
        try:
            image = Image.open(io.BytesIO(image_data))
            return {
                "format": image.format,
                "mode": image.mode,
                "size": image.size,
                "width": image.width,
                "height": image.height,
                "file_size": len(image_data)
            }
        except Exception as e:
            return {
                "error": f"Erro ao obter informações: {str(e)}"
            }
