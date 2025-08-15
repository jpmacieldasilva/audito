import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

class Settings:
    """Configurações da aplicação"""
    
    # Configurações da API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Audito Backend"
    VERSION: str = "1.0.0"
    
    # Configurações OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Configurações do servidor
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Configurações de upload
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_EXTENSIONS: set = {".png", ".jpg", ".jpeg"}
    
    # Configurações Agno
    AGNO_MODEL: str = os.getenv("AGNO_MODEL", "gpt-4o")
    
    def validate(self):
        """Valida se as configurações obrigatórias estão presentes"""
        if not self.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY é obrigatória no arquivo .env")

# Instância global das configurações
settings = Settings()

# Valida configurações na inicialização
try:
    settings.validate()
except ValueError as e:
    print(f"❌ Erro de configuração: {e}")
    print("⚠️  Certifique-se de que o arquivo .env está configurado corretamente")
