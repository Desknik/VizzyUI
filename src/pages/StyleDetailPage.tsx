
import { useParams, Link } from "react-router-dom";
import { useBackgroundStyle } from "@/hooks/useBackgroundStyles";
import { useBackgroundImages } from "@/hooks/useBackgroundImages";
import { useCommunityBackgrounds } from "@/hooks/useCommunityBackgrounds";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CommunityImageCard from "@/components/community/CommunityImageCard";

export default function StyleDetailPage() {
  const { styleId } = useParams<{ styleId: string }>();
  const { data: style, isLoading: isLoadingStyle } = useBackgroundStyle(styleId!);
  const { data: images, isLoading: isLoadingImages } = useBackgroundImages(styleId);
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
          <div>
            <h1 className="text-3xl font-bold mb-2">{style.name}</h1>
            {style.description && (
              <p className="text-muted-foreground">{style.description}</p>
            )}
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link to={`/create-image?style=${styleId}`}>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar com este estilo
            </Link>
          </Button>
        </div>

        {style.preview_image && (
          <Card className="overflow-hidden mb-8">
            <AspectRatio ratio={16 / 9} className="max-w-md mx-auto">
              <img
                src={style.preview_image}
                alt={style.name}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </Card>
        )}
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
          <TabsTrigger value="community">Comunidade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="mt-6">
          {isLoadingImages ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-[16/9]" />
              ))}
            </div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={image.image_url}
                      alt="Background gerado"
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/create-image?reference=${image.id}`}>
                        <Sparkles className="mr-2 h-3 w-3" />
                        Usar como referência
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
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
        </TabsContent>
        
        <TabsContent value="community" className="mt-6">
          {isLoadingCommunity ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-[16/9]" />
              ))}
            </div>
          ) : communityImages && communityImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityImages.map((image) => (
                <CommunityImageCard key={image.id} image={image} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Ainda não há backgrounds da comunidade para este estilo.
              </p>
              <Button asChild>
                <Link to={`/create-image?style=${styleId}`}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Seja o primeiro a contribuir
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
