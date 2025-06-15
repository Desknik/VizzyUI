
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  tokens: number;
  plan: string;
  api_access: boolean;
  playground_access: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_end: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user, fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Pick<Profile, 'name' | 'avatar_url'>>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile();
      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
      return false;
    }
  }, [user, fetchProfile]);

  const consumeToken = useCallback(async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('consume_token', {
        user_id: user.id
      });

      if (error) throw error;

      if (data) {
        await fetchProfile(); // Atualizar perfil para mostrar tokens atualizados
        return true;
      } else {
        toast.error('Tokens insuficientes para gerar imagem');
        return false;
      }
    } catch (error: any) {
      console.error('Error consuming token:', error);
      toast.error('Erro ao processar token');
      return false;
    }
  }, [user, fetchProfile]);

  return {
    profile,
    loading,
    updateProfile,
    consumeToken,
    refetchProfile: fetchProfile,
  };
}
