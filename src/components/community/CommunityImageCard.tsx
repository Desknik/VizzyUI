import React, { useState } from "react";
import { CommunityBackground } from "@/hooks/useCommunityBackgrounds";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Download, User, Repeat } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useBackgroundStyle } from "@/hooks/useBackgroundStyles";

interface CommunityImageCardProps {
  image: CommunityBackground;
  showStyleButton?: boolean;
}

export default function CommunityImageCard({ image, showStyleButton = true }: CommunityImageCardProps) {
  const [open, setOpen] = useState(false);
  // Busca o estilo se houver style_id
  const { data: style } = useBackgroundStyle(image.style_id || "");

  const getUserDisplayName = () => {
    if (image.user_email) {
      return image.user_email.split('@')[0];
    }
    return `Usuário ${image.user_id?.slice(0, 8) || 'Anônimo'}`;
  };

  const handleDownload = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Card
          className="overflow-hidden group relative cursor-pointer p-0 border-none shadow-none bg-transparent"
          onClick={() => setOpen(true)}
        >
          <AspectRatio ratio={16 / 9} className="relative">
            <img
              src={image.image_url}
              alt={image.name || "Background da comunidade"}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            {/* Top overlay - agora só aparece no hover */}
            <div className="absolute top-0 left-0 w-full flex justify-between p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 bg-black/60 rounded-xl px-2 py-1 text-xs text-white">
                <User className="h-3 w-3 mr-1" />
                <span className="max-w-20 truncate text-xs">{getUserDisplayName()}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/60 text-white hover:bg-black/80"
                onClick={e => { e.stopPropagation(); handleDownload(e); }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            {/* Footer overlay on hover */}
            <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col items-center z-10">
              <div className="w-full flex flex-col items-center">
                <span className="text-white font-medium text-base line-clamp-1 w-full text-center">{image.name || "Sem título"}</span>
                {style && (
                  <span className="text-xs text-gray-300 mt-1">{style.name}</span>
                )}
              </div>
              <div className="flex w-full justify-center gap-2 mt-4">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className=""
                >
                  <Link to={`/create-image?reference=${image.id}`} className="flex items-center">
                    <Repeat className="h-4 w-4 mr-2" />
                    Remix
                  </Link>
                </Button>
                {style && showStyleButton && (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className=""
                  >
                    <Link to={`/styles/${style.id}`} className="flex items-center">
                      Ver estilos
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </AspectRatio>
        </Card>
        {/* Dialog com detalhes da imagem */}
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{image.name || "Sem título"}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <User className="h-4 w-4" />
                <span>{getUserDisplayName()}</span>
                {style && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{style.name}</span>
                  </>
                )}
                <span className="mx-2">•</span>
                <span>{new Date(image.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col items-center gap-4">
            <img
              src={image.image_url}
              alt={image.name || "Background da comunidade"}
              className="rounded-lg max-h-[400px] w-auto object-contain border"
            />
            {image.prompt && (
              <div className="w-full bg-muted rounded p-3 text-sm text-muted-foreground">
                <span className="font-medium">Prompt:</span> {image.prompt}
              </div>
            )}
            <div className="flex w-full justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="flex items-center"
              >
                <Link to={`/create-image?reference=${image.id}`}>
                  <Repeat className="h-4 w-4 mr-2" />
                  Remix
                </Link>
              </Button>
              {style && showStyleButton && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                >
                  <Link to={`/styles/${style.id}`}>Ver estilos</Link>
                </Button>
              )}
              <DialogClose asChild>
                <Button variant="ghost" size="sm">Fechar</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
