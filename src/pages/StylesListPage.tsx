
import { useBackgroundStyles } from "@/hooks/useBackgroundStyles";
import StyleCard from "@/components/styles/StyleCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StylesListPage() {
  const { data: styles, isLoading, error } = useBackgroundStyles();

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Estilos de Background</h1>
          <p className="text-muted-foreground">
            Escolha um estilo para ver backgrounds gerados ou criar o seu próprio.
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/create-image">
            <Plus className="mr-2 h-4 w-4" />
            Criar background personalizado
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-4 text-center text-red-500">
          Erro ao carregar estilos. Por favor, tente novamente.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="w-full aspect-[16/9]" />
              <Skeleton className="h-8 w-3/4 mt-2" />
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles?.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>
      )}
    </div>
  );
}
