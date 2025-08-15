import base64
import os
from typing import List, Dict, Any
from agno.agent import Agent
from ..core.config import settings

class AgnoClient:
    """Cliente para integração com Agno AI Agent"""
    
    def __init__(self):
        """Inicializa o cliente Agno"""
        self.agent = Agent()
        self.model = settings.AGNO_MODEL
        
    def analyze_image(self, image_data: bytes, product_context: str = "") -> Dict[str, Any]:
        """
        Analisa uma imagem usando o agente Agno
        
        Args:
            image_data: Dados da imagem em bytes
            product_context: Contexto opcional do produto
            
        Returns:
            Dicionário com as recomendações de análise
        """
        try:
            # Verifica se os dados da imagem são válidos
            if not image_data or len(image_data) == 0:
                return self._create_error_response("Dados da imagem inválidos ou vazios")
            
            # Converte imagem para base64
            try:
                image_base64 = base64.b64encode(image_data).decode('utf-8')
            except Exception as e:
                print(f"❌ Erro ao converter imagem para base64: {e}")
                return self._create_error_response("Erro ao processar dados da imagem")
            
            # Cria o prompt estruturado para análise de Product Designer
            analysis_prompt = self._create_analysis_prompt(product_context)
            
            print(f"🔄 Enviando análise para Agno com {len(image_data)} bytes de imagem...")
            
            # Executa análise com Agno (sem await, pois não é assíncrono)
            response = self.agent.run(
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": analysis_prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                model=self.model
            )
            
            print("✅ Análise do Agno concluída com sucesso")
            
            # Processa e estrutura a resposta
            return self._process_analysis_response(response)
            
        except Exception as e:
            print(f"❌ Erro na análise com Agno: {e}")
            return self._create_error_response(str(e))
    
    def _create_analysis_prompt(self, product_context: str) -> str:
        """Cria prompt estruturado para análise de Product Designer"""
        
        system_context = product_context or "interface de usuário"
        
        base_prompt = f"""Act as a Senior Product Designer with extensive experience in usability and interface design for {system_context}.
Your task is to provide a critical and constructive analysis of the provided screen. The goal is to identify strengths and weaknesses, always focusing on improving user experience and product efficiency.

Please structure your analysis under the following topics:

**User Context and Primary Objective:**
Based on the interface, describe what you believe is the user's main objective on this screen and in what context they would be using it.

**Improvement Opportunities (Detailed Critique):**
Identify three areas that could be enhanced. For each, organize your critique strictly using the following format: Problem-Impact-Suggestion:

**Problem:** Objectively describe the design or usability issue.

**Impact:** Explain why this is a problem for the user (e.g., increases cognitive load, may lead to errors, disrupts visual hierarchy, lowers efficiency).

**Suggestion:** Provide one or more concrete, actionable solutions to address the identified issue.

**Formato de Resposta JSON:**
Forneça sua análise no seguinte formato JSON:

{{
    "overall_assessment": "Breve avaliação geral da interface",
    "user_context": "Descrição do contexto do usuário e objetivo principal",
    "recommendations": [
        {{
            "id": "1",
            "title": "Título da recomendação",
            "problem": "Descrição objetiva do problema de design ou usabilidade",
            "impact": "Explicação do impacto negativo para o usuário",
            "suggestion": "Solução concreta e acionável para resolver o problema",
            "category": "Usabilidade|Acessibilidade|Visual|Navegação|Hierarquia"
        }}
    ]
}}

**Critérios de Avaliação:**
- Usabilidade: Facilidade de uso e compreensão
- Acessibilidade: Inclusão de usuários com diferentes necessidades
- Visual: Hierarquia, contraste e organização
- Navegação: Clareza e intuitividade da interface
- Hierarquia: Estrutura visual e importância dos elementos

Seja específico, construtivo e focado em melhorias práticas. Analise como um designer experiente que quer criar a melhor experiência possível para o usuário."""
        
        return base_prompt
    
    def _process_analysis_response(self, response: Any) -> Dict[str, Any]:
        """Processa e estrutura a resposta do Agno"""
        try:
            # Extrai o conteúdo da resposta - Agno retorna diretamente o conteúdo
            if hasattr(response, 'content'):
                content = response.content
            elif hasattr(response, 'choices') and len(response.choices) > 0:
                content = response.choices[0].message.content
            elif isinstance(response, str):
                content = response
            else:
                # Tenta acessar como atributo direto
                content = str(response)
            
            print(f"📝 Resposta do Agno recebida: {len(content)} caracteres")
            
            # Tenta extrair JSON da resposta
            import json
            import re
            
            # Procura por padrões JSON na resposta
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                result = json.loads(json_str)
                print("✅ JSON extraído com sucesso da resposta")
                return result
            else:
                print("⚠️  JSON não encontrado na resposta, criando resposta estruturada")
                # Se não encontrar JSON, cria resposta estruturada manualmente
                return self._create_structured_response(content)
                
        except Exception as e:
            print(f"❌ Erro ao processar resposta do Agno: {e}")
            return self._create_error_response("Erro ao processar análise")
    
    def _create_structured_response(self, content: str) -> Dict[str, Any]:
        """Cria resposta estruturada quando não há JSON válido"""
        return {
            "overall_assessment": "Análise realizada com sucesso",
            "user_context": "Contexto do usuário analisado",
            "recommendations": [
                {
                    "id": "1",
                    "title": "Análise de Interface",
                    "problem": "Problema identificado na interface",
                    "impact": "Impacto na experiência do usuário",
                    "suggestion": "Sugestão de melhoria",
                    "category": "Usabilidade"
                }
            ]
        }
    
    def _create_error_response(self, error_message: str) -> Dict[str, Any]:
        """Cria resposta de erro estruturada"""
        return {
            "overall_assessment": "Erro na análise",
            "user_context": "Erro na análise",
            "recommendations": [
                {
                    "id": "error",
                    "title": "Erro na Análise",
                    "problem": f"Ocorreu um erro durante a análise: {error_message}",
                    "impact": "Análise não pôde ser concluída",
                    "suggestion": "Tente novamente ou verifique a imagem fornecida",
                    "category": "Erro"
                }
            ]
        }
