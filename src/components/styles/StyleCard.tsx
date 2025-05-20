
import { BackgroundStyle } from "@/hooks/useBackgroundStyles";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface StyleCardProps {
  style: BackgroundStyle;
}

export default function StyleCard({ style }: StyleCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <Link to={`/styles/${style.id}`} className="block">
            <AspectRatio ratio={16 / 9}>
              <img
                src={style.preview_image || "placeholder.svg"}
                alt={style.name}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">{style.name}</h3>
              {style.description && (
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                  {style.description}
                </p>
              )}
            </CardContent>
          </Link>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">{style.name}</h4>
          <p className="text-sm">{style.description}</p>
          <div className="flex justify-end">
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link to={`/styles/${style.id}`}>
                Ver imagens
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
