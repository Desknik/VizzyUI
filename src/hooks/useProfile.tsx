
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  tokens: number;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
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
  };

  const updateProfile = async (updates: Partial<Pick<Profile, 'name' | 'avatar_url'>>) => {
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
  };

  const consumeToken = async () => {
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
  };

  return {
    profile,
    loading,
    updateProfile,
    consumeToken,
    refetchProfile: fetchProfile,
  };
}
