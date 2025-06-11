
import { CommunityBackground } from "@/hooks/useCommunityBackgrounds";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { Sparkles, User } from "lucide-react";

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

  return (
    <TooltipProvider>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <AspectRatio ratio={16 / 9}>
          <img
            src={image.image_url}
            alt={image.name || "Background da comunidade"}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-sm line-clamp-1">
              {image.name || "Background sem título"}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  <span className="max-w-20 truncate">{getUserDisplayName()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Criado por: {getUserDisplayName()}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(image.created_at).toLocaleDateString('pt-BR')}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {image.prompt && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {image.prompt}
            </p>
          )}
          
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to={`/create-image?reference=${image.id}`}>
              <Sparkles className="mr-2 h-3 w-3" />
              Usar como referência
            </Link>
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
