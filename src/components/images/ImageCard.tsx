
import { BackgroundImage } from "@/hooks/useBackgroundImages";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface ImageCardProps {
  image: BackgroundImage;
  styleId?: string;
}

export default function ImageCard({ image, styleId }: ImageCardProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `background-${image.id.slice(0, 8)}.png`;
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
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="overflow-hidden group relative">
          <div className="aspect-[16/9]">
            <img 
              src={image.image_url} 
              alt="Background gerado por IA" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white"
              asChild
            >
              <Link to={`/create-image?reference=${image.id}`}>
                <Image className="h-4 w-4 mr-2" />
                Similar
              </Link>
            </Button>
          </div>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-64">
        <p className="text-sm font-medium mb-2">Prompt:</p>
        <p className="text-sm text-muted-foreground">{image.prompt}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
