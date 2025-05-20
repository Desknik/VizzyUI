
import { useAuth } from "@/hooks/useAuth";
import { useUserBackgroundImages } from "@/hooks/useBackgroundImages";
import ImageGrid from "@/components/images/ImageGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function UserHistoryPage() {
  const { user } = useAuth();
  const { data: images, isLoading } = useUserBackgroundImages(user?.id || null);

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para página inicial
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Seu histórico de imagens</h1>
      <p className="text-muted-foreground mb-6">
        Todas as imagens que você gerou com nossa aplicação.
      </p>

      {user ? (
        <ImageGrid images={images || []} isLoading={isLoading} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Faça login para ver seu histórico de imagens.
          </p>
          <Button asChild>
            <Link to="/auth">Login / Cadastro</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
