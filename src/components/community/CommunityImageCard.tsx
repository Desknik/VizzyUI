
import { CommunityBackground } from "@/hooks/useCommunityBackgrounds";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { Download, Eye, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface CommunityImageCardProps {
  image: CommunityBackground;
}

export default function CommunityImageCard({ image }: CommunityImageCardProps) {
  const getUserDisplayName = () => {
    if (image.user_email) {
      return image.user_email.split('@')[0];
    }
    return `Usuário ${image.user_id?.slice(0, 8) || 'Anônimo'}`;
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `background-${image.name || image.id.slice(0, 8)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Download iniciado!");
    } catch (error) {
      toast.error("Erro ao fazer download da imagem");
      console.error(error);
    }
  };

  return (
    <TooltipProvider>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={image.image_url}
            alt={image.name || "Background da comunidade"}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay com botões no hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/90 hover:bg-white text-black"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white text-black"
              asChild
            >
              <Link to={`/create-image?reference=${image.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Link>
            </Button>
          </div>
        </AspectRatio>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-sm line-clamp-1 flex-1">
              {image.name || "Background sem título"}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-muted-foreground ml-2">
                  <User className="h-3 w-3 mr-1" />
                  <span className="max-w-20 truncate">{getUserDisplayName()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  <p className="font-medium">Criado por: {getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(image.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  {image.prompt && (
                    <p className="text-xs mt-1 max-w-64">
                      <strong>Prompt:</strong> {image.prompt}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
