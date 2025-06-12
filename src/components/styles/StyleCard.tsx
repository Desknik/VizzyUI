
import { BackgroundStyle } from "@/hooks/useBackgroundStyles";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface StyleCardProps {
  style: BackgroundStyle;
  variant?: "default" | "compact";
}

export default function StyleCard({ style, variant = "default" }: StyleCardProps) {
  if (variant === "compact") {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link to={`/styles/${style.id}`} className="block">
            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors">
                <img
                  src={style.preview_image || "placeholder.svg"}
                  alt={style.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-sm font-medium text-center line-clamp-1">{style.name}</h3>
            </div>
          </Link>
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

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <Link to={`/styles/${style.id}`} className="block">
            <div className="aspect-square">
              <img
                src={style.preview_image || "placeholder.svg"}
                alt={style.name}
                className="object-cover w-full h-full"
              />
            </div>
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
