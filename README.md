# Sistema de Controle Financeiro

Sistema completo de controle financeiro pessoal e compartilhado com React, NestJS e Supabase.

## 🚀 Funcionalidades

- ✅ **Autenticação completa** (Login, Cadastro, Recuperação de senha)
- ✅ **Dashboard interativo** com resumo financeiro
- ✅ **Gestão de receitas e despesas**
- ✅ **Importação de faturas** de cartão de crédito (CSV/Excel)
- ✅ **Relatórios detalhados** e exportação
- ✅ **Compartilhamento de contas** com códigos únicos
- ✅ **Calculadora de vale transporte** (dias úteis)
- ✅ **Notificações via Telegram**
- ✅ **Design responsivo** para web e mobile
- ✅ **Interface moderna** com Ant Design

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Ant Design** para componentes UI
- **React Router** para navegação
- **Supabase Client** para autenticação

### Backend
- **NestJS** com TypeScript
- **Supabase** como banco de dados
- **Passport JWT** para autenticação
- **Swagger** para documentação da API
- **Multer** para upload de arquivos

### Banco de Dados
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)**
- **Triggers** e **Functions**

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Bot do Telegram (opcional)

### 1. Clone o repositório
\`\`\`bash
git clone <repository-url>
cd financial-control-system
\`\`\`

### 2. Instale as dependências
\`\`\`bash
# Instalar dependências de todos os projetos
npm run install:all

# Ou instalar individualmente
cd frontend && npm install
cd ../backend && npm install
\`\`\`

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute os scripts SQL na ordem:
   - `backend/scripts/001-create-tables.sql`
   - `backend/scripts/002-create-policies.sql`
   - `backend/scripts/003-seed-data.sql` (opcional)

### 4. Configure as variáveis de ambiente

**Backend (.env)**
\`\`\`env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_super_secret_jwt_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
NODE_ENV=development
PORT=3001
\`\`\`

**Frontend (.env)**
\`\`\`env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001
\`\`\`

### 5. Execute o projeto

\`\`\`bash
# Desenvolvimento - Frontend e Backend simultaneamente
npm run dev:frontend &
npm run dev:backend

# Ou execute separadamente
cd frontend && npm run dev
cd backend && npm run start:dev
\`\`\`

## 🔧 Scripts Disponíveis

\`\`\`bash
# Frontend
npm run dev:frontend          # Executar frontend em modo desenvolvimento
npm run build:frontend        # Build do frontend para produção

# Backend  
npm run dev:backend           # Executar backend em modo desenvolvimento
npm run build:backend         # Build do backend para produção

# Geral
npm run install:all           # Instalar dependências de todos os projetos
\`\`\`

## 📱 Como Usar

### 1. Cadastro/Login
- Acesse `http://localhost:3000`
- Crie uma conta ou faça login
- Confirme seu email (se necessário)

### 2. Dashboard
- Visualize resumo financeiro
- Acompanhe contas a pagar/pagas
- Veja gráficos de gastos por categoria

### 3. Receitas e Despesas
- Adicione receitas e despesas
- Categorize suas transações
- Defina status (pago, pendente, vencido)

### 4. Importação de Faturas
- Baixe o template CSV/Excel
- Preencha com dados da fatura
- Importe o arquivo
- Visualize itens processados

### 5. Compartilhamento
- Gere código único de compartilhamento
- Compartilhe com familiares/parceiros
- Gerencie permissões (admin, editor, visualizador)

### 6. Vale Transporte
- Selecione mês/ano
- Informe valor diário
- Calcule automaticamente dias úteis
- Adicione às despesas mensais

### 7. Relatórios
- Gere relatórios por período
- Visualize gastos por categoria
- Exporte dados em PDF/Excel

## 🔔 Configuração do Telegram

### 1. Criar Bot
1. Fale com [@BotFather](https://t.me/botfather)
2. Use `/newbot` e siga instruções
3. Copie o token gerado

### 2. Configurar Webhook (Produção)
\`\`\`bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-api.com/telegram/webhook"}'
\`\`\`

### 3. Obter Chat ID
1. Adicione o bot em um grupo ou chat privado
2. Envie uma mensagem
3. Acesse: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Copie o `chat.id`

## 🏗️ Estrutura do Projeto

\`\`\`
financial-control-system/
├── frontend/                 # React + Vite + Ant Design
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Context API (Auth, Financial)
│   │   ├── pages/           # Páginas principais
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # NestJS + Supabase
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── transactions/   # Módulo de transações
│   │   ├── invoices/       # Módulo de faturas
│   │   ├── notifications/  # Módulo de notificações
│   │   ├── share/          # Módulo de compartilhamento
│   │   ├── transport/      # Módulo de vale transporte
│   │   └── main.ts         # Entry point
│   ├── scripts/            # Scripts SQL
│   └── package.json
├── package.json            # Root package.json
└── README.md
\`\`\`

## 🔒 Segurança

- **Row Level Security (RLS)** no Supabase
- **JWT** para autenticação
- **Validação** de dados no backend
- **CORS** configurado adequadamente
- **Sanitização** de uploads de arquivo

## 🚀 Deploy

### Frontend (Vercel)
\`\`\`bash
cd frontend
npm run build
# Deploy para Vercel, Netlify, etc.
\`\`\`

### Backend (Railway/Heroku)
\`\`\`bash
cd backend
npm run build
# Configure variáveis de ambiente
# Deploy para Railway, Heroku, etc.
\`\`\`

### Banco de Dados
- Supabase já está em produção
- Configure backups automáticos
- Monitore performance

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@financialcontrol.com
- 💬 Telegram: [@financial_control_bot](https://t.me/financial_control_bot)
- 🐛 Issues: [GitHub Issues](https://github.com/user/financial-control/issues)

## 🎯 Roadmap

- [ ] **Mobile App** (React Native)
- [ ] **Integração bancária** (Open Banking)
- [ ] **IA para categorização** automática
- [ ] **Metas financeiras** e acompanhamento
- [ ] **Investimentos** e carteira
- [ ] **Multi-moeda** e conversão
- [ ] **Backup automático** na nuvem
- [ ] **Modo offline** com sincronização

---

**Desenvolvido com ❤️ para ajudar no controle financeiro pessoal**
