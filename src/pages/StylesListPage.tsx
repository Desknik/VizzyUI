
import { useBackgroundStyles } from "@/hooks/useBackgroundStyles";
import { useCommunityBackgrounds } from "@/hooks/useCommunityBackgrounds";
import StyleCarousel from "@/components/styles/StyleCarousel";
import CommunityImageCard from "@/components/community/CommunityImageCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StylesListPage() {
  const { data: styles, isLoading: stylesLoading, error: stylesError } = useBackgroundStyles();
  const { data: communityImages, isLoading: imagesLoading, error: imagesError } = useCommunityBackgrounds();

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Estilos de Background</h1>
          <p className="text-muted-foreground">
            Escolha um estilo ou explore backgrounds criados pela comunidade.
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/create-image">
            <Plus className="mr-2 h-4 w-4" />
            Criar background personalizado
          </Link>
        </Button>
      </div>

      {/* Carrossel de Estilos */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Estilos Disponíveis</h2>
        {stylesError ? (
          <div className="p-4 text-center text-red-500">
            Erro ao carregar estilos. Por favor, tente novamente.
          </div>
        ) : (
          <StyleCarousel />
        )}
      </div>

      {/* Grid de Backgrounds da Comunidade */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Backgrounds da Comunidade</h2>
        {imagesError ? (
          <div className="p-4 text-center text-red-500">
            Erro ao carregar backgrounds da comunidade. Por favor, tente novamente.
          </div>
        ) : imagesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[16/9]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {communityImages?.map((image) => (
              <CommunityImageCard key={image.id} image={image} />
            ))}
          </div>
        )}
        
        {!imagesLoading && communityImages?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum background da comunidade encontrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
