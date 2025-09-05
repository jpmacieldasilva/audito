# 🚀 Configuração do Projeto Audito

## ⚠️ Configuração Necessária

Para que o projeto funcione corretamente, você precisa configurar as variáveis de ambiente.

### 1. Criar arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# OpenAI Configuration (obrigatório)
# Obtenha sua API key em: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-actual-api-key-here

# Environment
NODE_ENV=development
```

### 2. Obter API Key do OpenAI

1. Acesse [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Faça login na sua conta OpenAI
3. Clique em "Create new secret key"
4. Copie a chave gerada
5. Cole no arquivo `.env.local` substituindo `sk-your-actual-api-key-here`

### 3. Reiniciar o servidor

Após criar o arquivo `.env.local`, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🔧 Problemas Conhecidos

### Erro 500 na API
- **Causa**: OPENAI_API_KEY não configurada
- **Solução**: Siga os passos acima para configurar a API key

### Erros 404 de arquivos estáticos
- **Causa**: Incompatibilidade entre Tailwind CSS v4 e configuração v3
- **Solução**: Já corrigido nas últimas atualizações

## 📝 Funcionalidades

- ✅ Upload e análise de imagens de interface
- ✅ Análise de URLs de páginas web
- ✅ Interface moderna e responsiva
- ✅ Tela de loading animada
- ✅ Resultados detalhados com recomendações

## 🚀 Como usar

1. Configure o `.env.local` (obrigatório)
2. Execute `npm run dev`
3. Acesse `http://localhost:3000`
4. Faça upload de uma imagem ou insira uma URL
5. Aguarde a análise e veja os resultados
