# 🔒 Sistema de Compartilhamento e Notificações

## 📋 Resumo das Funcionalidades

### 1. **Compartilhamento de Finanças**
- Cada usuário possui um código único de compartilhamento (`sharing_code`)
- O código permite que outras pessoas tenham **acesso total** às informações financeiras
- **NOVIDADE**: Agora é **bidirecional** - ambas as pessoas podem ver, editar e excluir transações
- Pessoas com o mesmo código compartilham todas as receitas, despesas e faturas
- Identificação visual de quem criou cada transação

### 2. **Notificações do Telegram**
- Configure seu Telegram ID para receber notificações automáticas
- Receba lembretes de vencimento de contas
- Alertas de faturas em atraso

---

## 🚀 Como Usar o Compartilhamento

### **Passo 1: Obter seu Código de Compartilhamento**

1. Faça login no sistema
2. Acesse **"Perfil"** no menu do usuário (canto superior direito)
3. Na seção **"Compartilhamento de Finanças"**, você encontrará:
   - **Código único**: `ef5650d3-4cdb-409f-b128-f28d615ddb63`
   - **Link direto**: `https://seudominio.com/compartilhar/ef5650d3-4cdb-409f-b128-f28d615ddb63`
   - **QR Code** para facilitar o compartilhamento

### **Passo 2: Compartilhar com Outras Pessoas**

**Opção A - Enviar o Código:**
```
Seu código de compartilhamento: ef5650d3-4cdb-409f-b128-f28d615ddb63
```

**Opção B - Enviar o Link Direto:**
```
https://seudominio.com/compartilhar/ef5650d3-4cdb-409f-b128-f28d615ddb63
```

**Opção C - Mostrar o QR Code:**
- Clique no ícone QR no perfil
- Mostre o QR Code para a pessoa escanear

### **Passo 3: Como a Outra Pessoa Acessa**

1. **Via Link Direto**: Clica no link e vai direto para a página de autorização
2. **Via Código**: Acessa `seudominio.com/compartilhar/CODIGO`
3. **Via QR Code**: Escaneia e acessa automaticamente

### **Passo 4: Autorização de Visualização**

1. A pessoa verá uma tela de confirmação com seu nome e email
2. Deve confirmar que tem autorização para visualizar suas finanças
3. Após autorizar, verá todos os seus dados financeiros:
   - Saldo do mês
   - Total de receitas e despesas
   - Últimas receitas
   - Próximas contas a pagar

---

## 📱 Como Configurar Notificações do Telegram

### **Passo 1: Criar/Configurar o Bot**

1. Abra o Telegram
2. Procure por `@BotFather`
3. Digite `/newbot` e siga as instruções
4. Anote o **Token do Bot** que será fornecido

### **Passo 2: Configurar o Token no Backend**

No arquivo `.env` do backend:
```bash
TELEGRAM_BOT_TOKEN=7988713586:AAGzZeEgXCDulxYNHa_gAVlD2ai_yOWhoJI
```

### **Passo 3: Obter seu Telegram ID**

1. Inicie uma conversa com seu bot criado
2. Digite `/start` para ativar o bot
3. Digite `/id` (se o bot tiver esse comando) ou use um bot auxiliar como `@userinfobot`
4. Anote seu **Telegram ID** (exemplo: `123456789`)

### **Passo 4: Configurar no Perfil**

1. Acesse **"Perfil"** no sistema
2. Clique em **"Editar"**
3. Preencha o campo **"Telegram ID"** com o número obtido
4. Salve as alterações

### **Passo 5: Testar as Notificações**

- O sistema enviará notificações automáticas para:
  - Contas próximas do vencimento
  - Faturas em atraso
  - Lembretes personalizados

---

## 🔐 Segurança e Privacidade

### **Sobre o Compartilhamento:**
- ✅ **Acesso total**: Pessoas com acesso podem ver, editar e excluir dados
- ✅ **Bidirecional**: Ambas as pessoas têm os mesmos privilégios
- ✅ **Identificação**: Sistema mostra quem criou cada transação
- ✅ **Confirmação obrigatória**: Sistema pede confirmação antes de mostrar dados
- ✅ **Sem login necessário**: Acesso direto via código/link
- ⚠️ **Confiança mútua**: Requer confiança entre as pessoas que compartilham

### **Sobre as Notificações:**
- ✅ **Privadas**: Apenas você recebe as notificações
- ✅ **Configurável**: Pode ativar/desativar quando quiser
- ✅ **Seguras**: Telegram ID é único e não compartilha dados pessoais

---

## 🛠️ Exemplo Prático de Uso

### **Cenário: Casal Compartilhando Finanças**

1. **João** cria sua conta no sistema
2. **João** acessa o perfil e copia seu código: `ef5650d3-4cdb-409f-b128-f28d615ddb63`
3. **João** envia o código para **Maria** via WhatsApp
4. **Maria** acessa: `seudominio.com/compartilhar/ef5650d3-4cdb-409f-b128-f28d615ddb63`
5. **Maria** confirma que tem autorização para ver as finanças do **João**
6. **Maria** visualiza todas as informações financeiras do **João**

### **Vantagens:**
- ✅ **Maria** sempre vê dados atualizados em tempo real
- ✅ **João** mantém controle total dos dados
- ✅ Ambos podem receber notificações no Telegram
- ✅ Transparência financeira completa entre o casal

---

## 🔧 Implementação Técnica

### **Backend Endpoints:**
```typescript
GET /users/profile           // Buscar dados do perfil
PUT /users/profile           // Atualizar perfil (nome, telegram_id)
GET /users/sharing/:code     // Buscar usuário por código de compartilhamento
```

### **Frontend Rotas:**
```typescript
/perfil                      // Página de perfil e configurações
/compartilhar/:sharingCode   // Página pública de visualização compartilhada
```

### **Banco de Dados:**
```sql
-- Campo sharing_code é único e gerado automaticamente
users.sharing_code UUID UNIQUE DEFAULT uuid_generate_v4()

-- Campo para Telegram ID
users.telegram_id VARCHAR(255)
```

---

## 📞 Suporte

Se você encontrar problemas:

1. **Código não funciona**: Verifique se copiou corretamente
2. **Telegram não recebe**: Confirme se o ID está correto
3. **Erro de autorização**: Verifique se a pessoa tem permissão
4. **Bot offline**: Verifique se o token está configurado

**Lembre-se**: O sistema foi projetado para ser simples e seguro. Compartilhe apenas com pessoas de confiança! 🔒
