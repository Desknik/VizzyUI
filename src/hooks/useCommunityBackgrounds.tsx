
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export type CommunityBackground = {
  id: string;
  image_url: string;
  prompt: string;
  style_id: string | null;
  user_id: string | null;
  created_at: string;
  is_public: boolean;
  name: string | null;
  user_email?: string;
};

export function useCommunityBackgrounds(styleId?: string) {
  return useQuery({
    queryKey: ["communityBackgrounds", styleId],
    queryFn: async (): Promise<CommunityBackground[]> => {
      let query = supabase
        .from("background_images")
        .select(`
          *,
          profiles:user_id (
            id,
            email
          )
        `)
        .eq("is_public", true)
        .not("user_id", "is", null)
        .order("created_at", { ascending: false });
      
      if (styleId) {
        query = query.eq("style_id", styleId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao carregar backgrounds da comunidade:", error);
        // Fallback: buscar sem join se não tiver profiles table
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("background_images")
          .select("*")
          .eq("is_public", true)
          .not("user_id", "is", null)
          .order("created_at", { ascending: false });

        if (fallbackError) {
          toast.error("Erro ao carregar backgrounds da comunidade", {
            description: fallbackError.message,
          });
          throw fallbackError;
        }

        return fallbackData || [];
      }

      return data || [];
    },
  });
}
