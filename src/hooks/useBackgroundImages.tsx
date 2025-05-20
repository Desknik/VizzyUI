
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export type BackgroundImage = {
  id: string;
  image_url: string;
  prompt: string;
  style_id: string | null;
  user_id: string | null;
  created_at: string;
  is_public: boolean;
};

export function useBackgroundImages(styleId?: string) {
  return useQuery({
    queryKey: ["backgroundImages", styleId],
    queryFn: async (): Promise<BackgroundImage[]> => {
      let query = supabase
        .from("background_images")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (styleId) {
        query = query.eq("style_id", styleId);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Erro ao carregar imagens", {
          description: error.message,
        });
        throw error;
      }

      return data || [];
    },
  });
}

export function useUserBackgroundImages(userId: string | null) {
  return useQuery({
    queryKey: ["userBackgroundImages", userId],
    queryFn: async (): Promise<BackgroundImage[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("background_images")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar histórico de imagens", {
          description: error.message,
        });
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
  });
}
