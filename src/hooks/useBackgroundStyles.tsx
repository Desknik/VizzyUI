
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export type BackgroundStyle = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  preview_image: string;
  created_at: string;
};

export function useBackgroundStyles() {
  return useQuery({
    queryKey: ["backgroundStyles"],
    queryFn: async (): Promise<BackgroundStyle[]> => {
      const { data, error } = await supabase
        .from("background_styles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar estilos", {
          description: error.message,
        });
        throw error;
      }

      return data || [];
    },
  });
}

export function useBackgroundStyle(styleId: string) {
  return useQuery({
    queryKey: ["backgroundStyle", styleId],
    queryFn: async (): Promise<BackgroundStyle | null> => {
      if (!styleId) return null;
      
      const { data, error } = await supabase
        .from("background_styles")
        .select("*")
        .eq("id", styleId)
        .single();

      if (error) {
        if (error.code !== "PGRST116") { // Not found error code
          toast.error("Erro ao carregar estilo", {
            description: error.message,
          });
        }
        return null;
      }

      return data;
    },
    enabled: !!styleId,
  });
}
