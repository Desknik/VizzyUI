
import { BackgroundImage } from "@/hooks/useBackgroundImages";
import ImageCard from "./ImageCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageGridProps {
  images: BackgroundImage[];
  isLoading?: boolean;
  styleId?: string;
}

export default function ImageGrid({ images, isLoading, styleId }: ImageGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full aspect-[16/9]" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma imagem encontrada.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} styleId={styleId} />
      ))}
    </div>
  );
}
