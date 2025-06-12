import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBackgroundStyles } from "@/hooks/useBackgroundStyles";
import { useCommunityBackgrounds } from "@/hooks/useCommunityBackgrounds";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Sparkles, ArrowLeft, Download, User } from "lucide-react";
import { Link } from "react-router-dom";
import LoginModal from "@/components/auth/LoginModal";
import CommunityImageCard from "@/components/community/CommunityImageCard";

export default function CreateImagePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const styleId = searchParams.get("style");
  const referenceId = searchParams.get("reference");
  
  const { data: styles } = useBackgroundStyles();
  const [selectedStyleId, setSelectedStyleId] = useState<string>(styleId || "");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImageName, setGeneratedImageName] = useState<string>("");
  const [improvedPrompt, setImprovedPrompt] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [referenceImage, setReferenceImage] = useState<{url: string, name: string, user_id?: string, style_id?: string} | null>(null);

  // Fetch related images based on reference
  const { data: relatedImages } = useCommunityBackgrounds(
    referenceImage?.style_id || undefined
  );

  useEffect(() => {
    if (styleId) {
      setSelectedStyleId(styleId);
    }
  }, [styleId]);

  useEffect(() => {
    const fetchReferenceImage = async () => {
      if (referenceId) {
        try {
          const { data, error } = await supabase
            .from("background_images")
            .select("*")
            .eq("id", referenceId)
            .single();

          if (error) throw error;
          if (data) {
            if (data.style_id) {
              setSelectedStyleId(data.style_id);
            }
            setCustomPrompt(data.prompt);
            setReferenceImage({
              url: data.image_url,
              name: data.name || "Imagem de referência",
              user_id: data.user_id,
              style_id: data.style_id
            });
          }
        } catch (error) {
          console.error("Error fetching reference image:", error);
        }
      }
    };

    fetchReferenceImage();
  }, [referenceId]);

  const selectedStyle = styles?.find(style => style.id === selectedStyleId);

  const getUserDisplayName = (userId?: string) => {
    return `Usuário ${userId?.slice(0, 8) || 'Anônimo'}`;
  };

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `background-${imageName || 'generated'}.png`;
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

  const generateImage = async () => {
    // Verificar se é prompt personalizado e se o usuário está logado
    if (customPrompt && !selectedStyleId && !user) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedStyleId && !customPrompt) {
      toast.error("Selecione um estilo ou forneça um prompt personalizado");
      return;
    }

    setIsGenerating(true);
    try {
      const webhookUrl = "https://vizzyui-n8n.fragments.com.br/webhook-test/c8390b0e-4bfa-43ff-8f4b-95724870f72c";
      
      let finalPrompt = "";
      
      if (selectedStyleId && selectedStyle) {
        // Se tem estilo selecionado
        if (customPrompt) {
          // Prompt personalizado + estilo
          finalPrompt = `user: ${customPrompt}, style: ${selectedStyle.prompt}`;
        } else {
          // Apenas estilo
          finalPrompt = selectedStyle.prompt;
        }
      } else {
        // Apenas prompt personalizado
        finalPrompt = customPrompt;
      }

      const requestBody = {
        user: user?.id || null,
        styleName: selectedStyle?.name || null,
        styleId: selectedStyleId || null,
        stylePrompt: selectedStyle?.prompt || null,
        prompt: finalPrompt
      };

      console.log("Enviando requisição para webhook:", requestBody);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Resposta do webhook:", data);

      // Esperamos que a API retorne: { imageUrl, name, improvedPrompt }
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setGeneratedImageName(data.name || "Background gerado");
        setImprovedPrompt(data.improvedPrompt || finalPrompt);
        setReferenceImage(null); // Limpar referência quando nova imagem é gerada
        toast.success("Imagem gerada com sucesso!");
      } else {
        throw new Error("API não retornou URL da imagem");
      }
    } catch (error: any) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Erro ao gerar imagem", { description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveImage = async () => {
    if (!generatedImage) return;
    
    try {
      const { data, error } = await supabase
        .from("background_images")
        .insert({
          image_url: generatedImage,
          prompt: improvedPrompt || customPrompt || (selectedStyle?.prompt || ""),
          name: generatedImageName,
          style_id: selectedStyleId || null,
          user_id: user?.id || null,
          is_public: true
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Imagem salva com sucesso!");
      
      // Redireciona para a página de detalhes do estilo ou para a página de histórico
      if (selectedStyleId) {
        navigate(`/styles/${selectedStyleId}`);
      } else {
        navigate("/history");
      }
    } catch (error: any) {
      toast.error("Erro ao salvar imagem", { description: error.message });
    }
  };

  // Filter related images to exclude the reference image
  const filteredRelatedImages = relatedImages?.filter(img => img.id !== referenceId) || [];

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to={selectedStyleId ? `/styles/${selectedStyleId}` : "/styles"}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {selectedStyleId ? "Voltar para o estilo" : "Voltar para estilos"}
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Criar background personalizado</h1>
      <p className="text-muted-foreground mb-6">
        Selecione um estilo ou crie seu próprio prompt para gerar uma imagem única.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="space-y-6">
            <div>
              <Label htmlFor="style">Estilo</Label>
              <Select
                value={selectedStyleId}
                onValueChange={(value) => {
                  setSelectedStyleId(value);
                  // Limpar o prompt personalizado quando um estilo é selecionado
                  if (value) setCustomPrompt("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um estilo" />
                </SelectTrigger>
                <SelectContent>
                  {styles?.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStyle && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedStyle.description}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <div className="flex-grow h-px bg-border"></div>
              <span className="px-4 text-sm text-muted-foreground">ou</span>
              <div className="flex-grow h-px bg-border"></div>
            </div>

            <div>
              <Label htmlFor="customPrompt">Prompt personalizado</Label>
              <Textarea
                id="customPrompt"
                placeholder="Descreva o background que você deseja gerar..."
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  // Limpar o estilo selecionado quando um prompt personalizado é inserido
                  if (e.target.value) setSelectedStyleId("");
                }}
                className="min-h-[120px]"
              />
              {customPrompt && !user && (
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ Você precisa estar logado para criar backgrounds com prompt personalizado
                </p>
              )}
            </div>

            <Button 
              onClick={generateImage} 
              disabled={isGenerating || (!selectedStyleId && !customPrompt)}
              className="w-full"
            >
              {isGenerating ? (
                <>Gerando...</>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar imagem
                </>
              )}
            </Button>
          </div>
        </div>

        <div>
          <Card className="overflow-hidden h-full flex items-center justify-center">
            {generatedImage ? (
              <div className="p-4 w-full">
                <img 
                  src={generatedImage} 
                  alt={generatedImageName || "Background gerado"} 
                  className="w-full rounded-md mb-4" 
                />
                {generatedImageName && (
                  <p className="text-sm font-medium mb-2">{generatedImageName}</p>
                )}
                {user && (
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <User className="h-3 w-3 mr-1" />
                    <span>Criado por: {user.email?.split('@')[0] || 'Você'}</span>
                  </div>
                )}
                {improvedPrompt && improvedPrompt !== (customPrompt || selectedStyle?.prompt) && (
                  <p className="text-xs text-muted-foreground mb-4">
                    <strong>Prompt melhorado:</strong> {improvedPrompt}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDownload(generatedImage, generatedImageName)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                  <Button onClick={saveImage} className="flex-1">
                    Salvar imagem
                  </Button>
                </div>
              </div>
            ) : referenceImage ? (
              <div className="p-4 w-full">
                <img 
                  src={referenceImage.url} 
                  alt={referenceImage.name} 
                  className="w-full rounded-md mb-4" 
                />
                <p className="text-sm font-medium mb-2 text-center text-muted-foreground">
                  📸 {referenceImage.name}
                </p>
                {referenceImage.user_id && (
                  <div className="flex items-center justify-center text-xs text-muted-foreground mb-2">
                    <User className="h-3 w-3 mr-1" />
                    <span>Criado por: {getUserDisplayName(referenceImage.user_id)}</span>
                  </div>
                )}
                <p className="text-xs text-center text-muted-foreground mb-4">
                  Esta imagem será usada como referência para gerar uma nova
                </p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => handleDownload(referenceImage.url, referenceImage.name)} 
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar imagem de referência
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  A visualização da imagem aparecerá aqui
                </p>
                <p className="text-muted-foreground">
                  Selecione um estilo ou forneça um prompt personalizado e clique em "Gerar imagem"
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Related Images Section */}
      {referenceImage && filteredRelatedImages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">
            {referenceImage.style_id ? 'Outras imagens do mesmo estilo' : 'Outras imagens do mesmo usuário'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRelatedImages.slice(0, 8).map((image) => (
              <CommunityImageCard key={image.id} image={image} />
            ))}
          </div>
        </div>
      )}

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal} 
      />
    </div>
  );
}
