
import { useParams, Link } from "react-router-dom";
import { useBackgroundStyle } from "@/hooks/useBackgroundStyles";
import { useBackgroundImages } from "@/hooks/useBackgroundImages";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ImageGrid from "@/components/images/ImageGrid";

export default function StyleDetailPage() {
  const { styleId } = useParams<{ styleId: string }>();
  const { data: style, isLoading: styleLoading } = useBackgroundStyle(styleId || "");
  const { data: images, isLoading: imagesLoading } = useBackgroundImages(styleId);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/styles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para estilos
          </Link>
        </Button>

        {styleLoading ? (
          <>
            <Skeleton className="h-10 w-2/3 max-w-md mb-2" />
            <Skeleton className="h-5 w-full max-w-2xl" />
          </>
        ) : style ? (
          <>
            <h1 className="text-3xl font-bold mb-2">{style.name}</h1>
            <p className="text-muted-foreground mb-6">{style.description}</p>
          </>
        ) : (
          <p className="text-red-500">Estilo não encontrado</p>
        )}

        <div className="flex flex-wrap gap-4 mb-8">
          <Button asChild>
            <Link to={`/create-image?style=${styleId}`}>
              <Plus className="mr-2 h-4 w-4" />
              Criar com este estilo
            </Link>
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Backgrounds deste estilo</h2>
      <ImageGrid images={images || []} isLoading={imagesLoading} styleId={styleId} />
    </div>
  );
}
