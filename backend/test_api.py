#!/usr/bin/env python3
"""
Script de teste para verificar a API
"""

import requests
import json

def test_api():
    """Testa a API do backend"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testando API do backend...")
    
    # Teste 1: Health check
    try:
        response = requests.get(f"{base_url}/api/health")
        print(f"✅ Health check: {response.status_code}")
        print(f"   Resposta: {response.json()}")
    except Exception as e:
        print(f"❌ Health check falhou: {e}")
        return
    
    # Teste 2: Rota raiz
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Rota raiz: {response.status_code}")
        print(f"   Resposta: {response.json()}")
    except Exception as e:
        print(f"❌ Rota raiz falhou: {e}")
    
    # Teste 3: CORS preflight
    try:
        headers = {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{base_url}/api/analyze/upload", headers=headers)
        print(f"✅ CORS preflight: {response.status_code}")
        print(f"   Headers CORS: {dict(response.headers)}")
    except Exception as e:
        print(f"❌ CORS preflight falhou: {e}")
    
    # Teste 4: Upload com arquivo real
    try:
        # Cria um arquivo de teste
        test_file_content = b"fake_image_data_for_testing"
        
        files = {'file': ('test.jpg', test_file_content, 'image/jpeg')}
        data = {'product_context': 'teste de API'}
        
        response = requests.post(f"{base_url}/api/analyze/upload", files=files, data=data)
        print(f"✅ Upload API: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   Sucesso: {result.get('success', 'N/A')}")
            print(f"   Recomendações: {len(result.get('recommendations', []))}")
        else:
            print(f"   Erro: {response.text}")
            
    except Exception as e:
        print(f"❌ Upload API falhou: {e}")

if __name__ == "__main__":
    test_api()
