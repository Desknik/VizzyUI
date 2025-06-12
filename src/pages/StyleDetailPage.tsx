
import { useParams, Link } from "react-router-dom";
import { useBackgroundStyle } from "@/hooks/useBackgroundStyles";
import { useCommunityBackgrounds } from "@/hooks/useCommunityBackgrounds";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CommunityImageCard from "@/components/community/CommunityImageCard";
import StyleCard from "@/components/styles/StyleCard";

export default function StyleDetailPage() {
  const { styleId } = useParams<{ styleId: string }>();
  const { data: style, isLoading: isLoadingStyle } = useBackgroundStyle(styleId!);
  const { data: communityImages, isLoading: isLoadingCommunity } = useCommunityBackgrounds(styleId);

  if (isLoadingStyle) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="w-full aspect-[16/9]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Estilo não encontrado</h1>
          <Button asChild>
            <Link to="/styles">Voltar para estilos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/styles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para estilos
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border">
              <img
                src={style.preview_image || "placeholder.svg"}
                alt={style.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{style.name}</h1>
              {style.description && (
                <p className="text-muted-foreground">{style.description}</p>
              )}
            </div>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to={`/create-image?style=${styleId}`}>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar com este estilo
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-6">Backgrounds do Estilo</h2>
        {isLoadingCommunity ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[16/9]" />
            ))}
          </div>
        ) : communityImages && communityImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {communityImages.map((image) => (
              <CommunityImageCard key={image.id} image={image} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Ainda não há backgrounds gerados para este estilo.
            </p>
            <Button asChild>
              <Link to={`/create-image?style=${styleId}`}>
                <Sparkles className="mr-2 h-4 w-4" />
                Seja o primeiro a gerar
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
