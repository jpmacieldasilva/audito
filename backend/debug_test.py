#!/usr/bin/env python3
"""
Script de debug para testar o serviço de análise
"""

import sys
import os
sys.path.append('.')

from app.services.analysis_service import AnalysisService
from app.core.agno_client import AgnoClient
from app.core.config import settings

def test_analysis_service():
    """Testa o serviço de análise passo a passo"""
    try:
        print("🧪 Testando serviço de análise...")
        
        # Teste 1: Criação do serviço
        print("1️⃣ Criando AnalysisService...")
        analysis_service = AnalysisService()
        print("✅ AnalysisService criado com sucesso")
        
        # Teste 2: Criação do cliente Agno
        print("2️⃣ Criando AgnoClient...")
        agno_client = AgnoClient()
        print("✅ AgnoClient criado com sucesso")
        
        # Teste 3: Teste com dados fake
        print("3️⃣ Testando análise com dados fake...")
        fake_image_data = b"fake_image_data_for_testing"
        fake_filename = "test.jpg"
        fake_context = "interface de teste"
        
        print(f"   - Dados da imagem: {len(fake_image_data)} bytes")
        print(f"   - Nome do arquivo: {fake_filename}")
        print(f"   - Contexto: {fake_context}")
        
        # Executa análise
        success, result, error_msg = analysis_service.analyze_uploaded_image(
            fake_image_data, 
            fake_filename, 
            fake_context
        )
        
        print(f"4️⃣ Resultado da análise:")
        print(f"   - Sucesso: {success}")
        print(f"   - Erro: {error_msg}")
        
        if success:
            print(f"   - Resultado: {result}")
        else:
            print(f"   - Mensagem de erro: {error_msg}")
            
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")
        import traceback
        traceback.print_exc()

def test_agno_directly():
    """Testa o Agno diretamente"""
    try:
        print("\n🔍 Testando Agno diretamente...")
        
        agno_client = AgnoClient()
        fake_image_data = b"fake_image_data_for_testing"
        fake_context = "interface de teste"
        
        print("   - Enviando análise para Agno...")
        result = agno_client.analyze_image(fake_image_data, fake_context)
        
        print(f"   - Resultado do Agno: {result}")
        
    except Exception as e:
        print(f"❌ Erro no teste do Agno: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🚀 Iniciando testes de debug...")
    test_analysis_service()
    test_agno_directly()
    print("\n✅ Testes concluídos!")
