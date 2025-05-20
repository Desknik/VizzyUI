
import { useBackgroundStyles, type BackgroundStyle } from "@/hooks/useBackgroundStyles";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import StyleCard from "./StyleCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StyleCarousel() {
  const { data: styles, isLoading, error } = useBackgroundStyles();

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Erro ao carregar estilos. Por favor, tente novamente.
      </div>
    );
  }

  if (isLoading) {
    return <StyleCarouselSkeleton />;
  }

  return (
    <Carousel
      className="w-full max-w-5xl mx-auto"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {styles?.map((style) => (
          <CarouselItem key={style.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <StyleCard style={style} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4">
        <CarouselPrevious className="static translate-y-0 mx-2" />
        <CarouselNext className="static translate-y-0 mx-2" />
      </div>
    </Carousel>
  );
}

function StyleCarouselSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
