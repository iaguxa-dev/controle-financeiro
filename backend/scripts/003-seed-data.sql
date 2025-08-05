-- Dados de exemplo para desenvolvimento
-- ATENÇÃO: Execute apenas em ambiente de desenvolvimento

-- Inserir categorias padrão (você pode criar uma tabela separada para isso)
-- Por enquanto, as categorias estão hardcoded no frontend

-- Função para gerar códigos de compartilhamento
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'FIN-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo apenas se não existirem
-- (Substitua os UUIDs pelos IDs reais dos usuários após o cadastro)

-- Exemplo de conta compartilhada
-- INSERT INTO public.shared_accounts (name, share_code, owner_id)
-- VALUES ('Família Silva', generate_share_code(), 'user-uuid-here')
-- ON CONFLICT DO NOTHING;

-- Exemplo de transações
-- INSERT INTO public.transactions (user_id, type, description, amount, category, date, status)
-- VALUES 
--   ('user-uuid-here', 'income', 'Salário Janeiro', 5000.00, 'Trabalho', '2024-01-05', 'paid'),
--   ('user-uuid-here', 'expense', 'Supermercado', 387.45, 'Alimentação', '2024-01-03', 'paid'),
--   ('user-uuid-here', 'expense', 'Combustível', 150.00, 'Transporte', '2024-01-02', 'paid')
-- ON CONFLICT DO NOTHING;
