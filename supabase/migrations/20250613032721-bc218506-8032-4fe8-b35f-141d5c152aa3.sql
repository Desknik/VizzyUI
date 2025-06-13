
-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  tokens INTEGER NOT NULL DEFAULT 10, -- Tokens gratuitos iniciais
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem seu próprio perfil
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Política para usuários atualizarem seu próprio perfil
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Política para inserir perfil (será usado pelo trigger)
CREATE POLICY "Enable insert for service role" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, tokens)
  VALUES (new.id, 10); -- 10 tokens gratuitos
  RETURN new;
END;
$$;

-- Trigger para executar a função quando novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para decrementar tokens ao gerar imagem
CREATE OR REPLACE FUNCTION public.consume_token(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_tokens INTEGER;
BEGIN
  -- Verificar tokens atuais
  SELECT tokens INTO current_tokens 
  FROM public.profiles 
  WHERE id = user_id;
  
  -- Se não tem tokens suficientes, retornar false
  IF current_tokens IS NULL OR current_tokens < 1 THEN
    RETURN FALSE;
  END IF;
  
  -- Decrementar token
  UPDATE public.profiles 
  SET tokens = tokens - 1, updated_at = now()
  WHERE id = user_id;
  
  RETURN TRUE;
END;
$$;
