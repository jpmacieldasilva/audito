# Audito - Análise de Interfaces com IA

Audito é uma aplicação web que analisa interfaces de usuário usando inteligência artificial para fornecer insights sobre usabilidade e acessibilidade.

## 🚀 Funcionalidades

- **Upload de imagens**: Analise screenshots ou imagens de interfaces
- **Análise de URLs**: Analise páginas web diretamente pela URL
- **Screenshots automáticos**: Captura automática de páginas web usando Puppeteer (apenas no Vercel)
- **Análise com IA**: Usa OpenAI GPT-4 Vision para análise detalhada
- **Recomendações estruturadas**: Receba sugestões práticas de melhoria
- **Interface moderna**: Design responsivo e intuitivo

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: API Routes do Next.js
- **IA**: OpenAI GPT-4 Vision
- **Screenshots**: Puppeteer (gratuito no Vercel)
- **UI**: Radix UI, Tailwind CSS
- **Deploy**: Vercel

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd audito
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# OpenAI Configuration (obrigatório)
OPENAI_API_KEY=your_openai_api_key_here

# Environment
NODE_ENV=development
```

4. **Execute o projeto**
```bash
npm run dev
# ou
pnpm dev
```

5. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔧 Configuração

### OpenAI API Key
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Crie uma conta ou faça login
3. Vá para "API Keys" e crie uma nova chave
4. Adicione a chave no arquivo `.env.local`

### Screenshots de Páginas Web
- **Local**: Não disponível (apenas análise de imagens diretas)
- **Vercel**: Funciona automaticamente com Puppeteer
- **Limitação**: Screenshots só funcionam em produção no Vercel

## 🚀 Deploy no Vercel

1. **Conecte seu repositório**
- Faça push do código para GitHub/GitLab
- Conecte o repositório no Vercel

2. **Configure as variáveis de ambiente**
No dashboard do Vercel, adicione as variáveis:
- `OPENAI_API_KEY` (obrigatório)

3. **Deploy**
O Vercel detectará automaticamente que é um projeto Next.js e fará o deploy.

## 📁 Estrutura do Projeto

```
audito/
├── app/
│   ├── api/                    # API Routes
│   │   ├── analyze/
│   │   │   ├── upload/         # Upload de imagens
│   │   │   └── url/           # Análise de URLs + Screenshots
│   │   └── health/            # Health check
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Página principal
├── components/
│   ├── loading-screen.tsx
│   ├── results-screen.tsx
│   └── ui/                    # Componentes UI
├── public/                    # Arquivos estáticos
├── vercel.json               # Configuração do Vercel
└── package.json
```

## 🔌 API Endpoints

### POST `/api/analyze/upload`
Analisa imagem enviada via upload.

**Body (FormData):**
- `file`: Arquivo de imagem (PNG, JPG, JPEG, máximo 5MB)
- `product_context`: Contexto opcional do produto

### POST `/api/analyze/url`
Analisa imagem ou página web via URL.

**Body (JSON):**
```json
{
  "url": "https://example.com",
  "product_context": "Contexto opcional"
}
```

**Nota**: Screenshots de páginas web só funcionam em produção no Vercel.

### GET `/api/health`
Health check da API.

## 🎨 Personalização

### Modificar o Prompt de Análise
Edite a função `createAnalysisPrompt()` nos arquivos:
- `app/api/analyze/upload/route.ts`
- `app/api/analyze/url/route.ts`

### Adicionar Novos Critérios
Modifique a estrutura de resposta para incluir novos critérios de avaliação.

## 🔒 Segurança

- Validação de arquivos no frontend e backend
- Limite de tamanho de arquivo (5MB)
- Validação de URLs
- Sanitização de inputs
- Timeout de 30 segundos para screenshots
- Rate limiting (configurável)

## 💡 Vantagens do Puppeteer no Vercel

- ✅ **Totalmente gratuito** no Vercel
- ✅ **Sem limites** de screenshots
- ✅ **Alta qualidade** de captura
- ✅ **Suporte a JavaScript** dinâmico
- ✅ **Configuração automática** no deploy
- ✅ **Sem configuração local** necessária

## 🚧 Limitações

- **Desenvolvimento local**: Screenshots de páginas web não funcionam
- **Apenas imagens diretas**: URLs de imagens (.jpg, .png, etc.) funcionam localmente
- **Produção**: Todas as funcionalidades disponíveis no Vercel

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
