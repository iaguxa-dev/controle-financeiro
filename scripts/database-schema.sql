-- Criação das tabelas no Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  telegram_id VARCHAR(255),
  sharing_code UUID UNIQUE DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de compartilhamentos
CREATE TABLE compartilhamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shared_with_id UUID REFERENCES users(id) ON DELETE CASCADE,
  can_edit BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(owner_id, shared_with_id)
);

-- Tabela de receitas
CREATE TABLE receitas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_recebimento DATE NOT NULL,
  categoria VARCHAR(100),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de despesas
CREATE TABLE despesas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  categoria VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, pago, vencido
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de faturas
CREATE TABLE faturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  banco VARCHAR(100) NOT NULL,
  competencia VARCHAR(7) NOT NULL, -- MM/YYYY
  estabelecimento VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_transacao DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de simulações de vale-transporte
CREATE TABLE vale_transporte_simulacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dias_uteis INTEGER NOT NULL,
  custo_por_dia DECIMAL(10,2) NOT NULL,
  ida_volta BOOLEAN DEFAULT true,
  total_estimado DECIMAL(10,2) NOT NULL,
  mes_referencia VARCHAR(7) NOT NULL, -- MM/YYYY
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- fatura_importada, despesa_alta, lembrete_conta
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  enviado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_receitas_user_id ON receitas(user_id);
CREATE INDEX idx_receitas_data ON receitas(data_recebimento);
CREATE INDEX idx_despesas_user_id ON despesas(user_id);
CREATE INDEX idx_despesas_data ON despesas(data_vencimento);
CREATE INDEX idx_faturas_user_id ON faturas(user_id);
CREATE INDEX idx_faturas_competencia ON faturas(competencia);

-- RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vale_transporte_simulacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compartilhamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own receitas" ON receitas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own despesas" ON despesas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own faturas" ON faturas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own simulacoes" ON vale_transporte_simulacoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notificacoes" ON notificacoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own compartilhamentos" ON compartilhamentos FOR ALL USING (auth.uid() = owner_id OR auth.uid() = shared_with_id);
