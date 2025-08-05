-- Habilitar RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_account_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imported_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para shared_accounts
CREATE POLICY "Users can view shared accounts they own or are members of" ON public.shared_accounts
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM public.shared_account_members 
      WHERE shared_account_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create shared accounts" ON public.shared_accounts
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their shared accounts" ON public.shared_accounts
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their shared accounts" ON public.shared_accounts
  FOR DELETE USING (auth.uid() = owner_id);

-- Políticas para shared_account_members
CREATE POLICY "Users can view members of accounts they have access to" ON public.shared_account_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shared_accounts 
      WHERE id = shared_account_id AND (
        owner_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.shared_account_members sam 
          WHERE sam.shared_account_id = id AND sam.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Account owners can manage members" ON public.shared_account_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.shared_accounts 
      WHERE id = shared_account_id AND owner_id = auth.uid()
    )
  );

-- Políticas para transactions
CREATE POLICY "Users can view own transactions or shared account transactions" ON public.transactions
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (shared_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.shared_account_members 
      WHERE shared_account_id = transactions.shared_account_id AND user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (shared_account_id IS NULL OR EXISTS (
      SELECT 1 FROM public.shared_account_members 
      WHERE shared_account_id = transactions.shared_account_id AND user_id = auth.uid() AND role IN ('admin', 'editor')
    ))
  );

CREATE POLICY "Users can update own transactions or shared account transactions with permission" ON public.transactions
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (shared_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.shared_account_members 
      WHERE shared_account_id = transactions.shared_account_id AND user_id = auth.uid() AND role IN ('admin', 'editor')
    ))
  );

CREATE POLICY "Users can delete own transactions or shared account transactions with permission" ON public.transactions
  FOR DELETE USING (
    auth.uid() = user_id OR 
    (shared_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.shared_account_members 
      WHERE shared_account_id = transactions.shared_account_id AND user_id = auth.uid() AND role IN ('admin', 'editor')
    ))
  );

-- Políticas para imported_invoices
CREATE POLICY "Users can view own invoices or shared account invoices" ON public.imported_invoices
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (shared_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.shared_account_members 
      WHERE shared_account_id = imported_invoices.shared_account_id AND user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can create invoices" ON public.imported_invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para invoice_items
CREATE POLICY "Users can view invoice items they have access to" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.imported_invoices 
      WHERE id = invoice_id AND (
        user_id = auth.uid() OR 
        (shared_account_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.shared_account_members 
          WHERE shared_account_id = imported_invoices.shared_account_id AND user_id = auth.uid()
        ))
      )
    )
  );

-- Políticas para transport_calculations
CREATE POLICY "Users can view own transport calculations or shared account calculations" ON public.transport_calculations
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (shared_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.shared_account_members 
      WHERE shared_account_id = transport_calculations.shared_account_id AND user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can create transport calculations" ON public.transport_calculations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transport calculations" ON public.transport_calculations
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
