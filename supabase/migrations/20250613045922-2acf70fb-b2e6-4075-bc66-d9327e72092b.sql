
-- Atualizar tabela profiles para incluir informações do plano
ALTER TABLE public.profiles 
ADD COLUMN plan TEXT NOT NULL DEFAULT 'free',
ADD COLUMN api_access BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN playground_access BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN subscription_status TEXT,
ADD COLUMN subscription_end TIMESTAMP WITH TIME ZONE;

-- Função para atualizar plano do usuário (será chamada via webhook)
CREATE OR REPLACE FUNCTION public.update_user_plan(
  user_id UUID,
  new_plan TEXT,
  new_tokens INTEGER,
  api_access_enabled BOOLEAN,
  playground_access_enabled BOOLEAN,
  customer_id TEXT DEFAULT NULL,
  subscription_id TEXT DEFAULT NULL,
  sub_status TEXT DEFAULT NULL,
  sub_end TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    plan = new_plan,
    tokens = new_tokens,
    api_access = api_access_enabled,
    playground_access = playground_access_enabled,
    stripe_customer_id = customer_id,
    stripe_subscription_id = subscription_id,
    subscription_status = sub_status,
    subscription_end = sub_end,
    updated_at = now()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$;

-- Função para resetar tokens mensalmente
CREATE OR REPLACE FUNCTION public.reset_monthly_tokens()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Resetar tokens baseado no plano
  UPDATE public.profiles 
  SET 
    tokens = CASE 
      WHEN plan = 'basic' THEN 50
      WHEN plan = 'creator' THEN 150
      WHEN plan = 'pro' THEN 500
      WHEN plan = 'dev' THEN 1000
      ELSE 10 -- free plan
    END,
    updated_at = now()
  WHERE plan != 'free' AND subscription_status = 'active';
END;
$$;

-- Política para edge functions atualizarem planos
CREATE POLICY "Enable plan updates for service role" 
  ON public.profiles 
  FOR UPDATE 
  USING (true);
