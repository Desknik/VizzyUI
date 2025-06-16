import {
  useBackgroundStyles,
  type BackgroundStyle,
} from "@/hooks/useBackgroundStyles";
import StyleCard from "./StyleCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import React from "react";
import { cn } from "@/lib/utils";

interface StyleCarouselProps {
  autoScroll?: boolean;
}

export default function StyleCarousel({
  autoScroll = false,
}: StyleCarouselProps) {
  const { data: styles, isLoading, error } = useBackgroundStyles();
  const autoScrollRef = React.useRef<unknown>(null);

  // Configura plugins se autoScroll estiver ativado
  const plugins = React.useMemo(() => {
    if (autoScroll) {
      const plugin = AutoScroll({
        speed: 2,
        startDelay: 0,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      });
      autoScrollRef.current = plugin;
      return [plugin];
    }
    return undefined;
  }, [autoScroll]);

  // Handler para retomar o auto-scroll ao sair o mouse
  const handleMouseLeave = React.useCallback(() => {
    if (
      autoScroll &&
      autoScrollRef.current &&
      typeof (autoScrollRef.current as { play?: () => void }).play ===
        "function"
    ) {
      setTimeout(() => {
        (autoScrollRef.current as { play?: () => void }).play?.();
      }, 600); // delay de 600ms
    }
  }, [autoScroll]);

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
      plugins={plugins}
      opts={{ loop: true, align: "start" }}
      className={cn("m-auto", !autoScroll && "w-[calc(100%-6rem)]")}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselContent>
        {styles?.map((style) => (
          <CarouselItem
            key={style.id}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 2xl:basis-[12.5%]"
          >
            <StyleCard style={style} variant="compact" />
          </CarouselItem>
        ))}
      </CarouselContent>
      {!autoScroll && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}

function StyleCarouselSkeleton() {
  return (
    <Carousel>
      <CarouselContent>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CarouselItem
            key={i}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 2xl:basis-[12.5%]"
          >
            <div className="flex flex-col items-center space-y-2 p-2">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
