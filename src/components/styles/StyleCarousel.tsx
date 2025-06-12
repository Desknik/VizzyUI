import { useBackgroundStyles, type BackgroundStyle } from "@/hooks/useBackgroundStyles";
import StyleCard from "./StyleCard";
import { Skeleton } from "@/components/ui/skeleton";
export default function StyleCarousel() {
  const {
    data: styles,
    isLoading,
    error
  } = useBackgroundStyles();
  if (error) {
    return <div className="p-4 text-center text-red-500">
        Erro ao carregar estilos. Por favor, tente novamente.
      </div>;
  }
  if (isLoading) {
    return <StyleCarouselSkeleton />;
  }
  return <div className="w-full">
      <div className="flex overflow-x-auto pb-4 scrollbar-hide">
        {styles?.map(style => <div key={style.id} className="flex-shrink-0">
            <StyleCard style={style} variant="compact" />
          </div>)}
      </div>
    </div>;
}
function StyleCarouselSkeleton() {
  return <div className="w-full">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="flex-shrink-0 flex flex-col items-center space-y-2 p-2">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>)}
      </div>
    </div>;
}