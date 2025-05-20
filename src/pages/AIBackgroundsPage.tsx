
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Upload, Wand } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type StyleCategory = {
  id: string;
  name: string;
  description: string;
  prompt: string;
  previewImage: string;
};

const styleCategories: StyleCategory[] = [
  {
    id: "holographic",
    name: "Holográfico",
    description: "Efeitos holográficos vibrantes com cores iridescentes",
    prompt: "Um background holográfico com efeitos iridescentes, cores vibrantes roxo e azul com brilho metálico e padrões abstratos fluidos",
    previewImage: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "gradient",
    name: "Gradientes",
    description: "Gradientes modernos e coloridos para fundos elegantes",
    prompt: "Um background com gradiente suave e moderno, cores fluidas que se mesclam harmoniosamente, estilo minimalista contemporâneo",
    previewImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "wave",
    name: "Ondas",
    description: "Padrões ondulados fluidos e orgânicos",
    prompt: "Um background com padrões de ondas suaves e orgânicas, movimento fluido, cores suaves em tons pastéis que se misturam",
    previewImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "neon",
    name: "Neon",
    description: "Luzes de neon vibrantes sobre fundos escuros",
    prompt: "Um background com luzes de neon vibrantes sobre fundo escuro, cores brilhantes e saturadas que emitem luz, estilo cyberpunk urbano",
    previewImage: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "geometric",
    name: "Geométrico",
    description: "Padrões geométricos modernos e precisos",
    prompt: "Um background com padrões geométricos precisos, formas minimalistas, contraste de cores, estilo contemporâneo com linhas limpas",
    previewImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=300&q=80"
  }
];

export default function AIBackgroundsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"style" | "reference">("style");
  const [selectedStyle, setSelectedStyle] = useState<StyleCategory | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("");

  const handleStyleSelect = (style: StyleCategory) => {
    setSelectedStyle(style);
    setCustomPrompt(style.prompt);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBackground = async () => {
    if (!n8nWebhookUrl) {
      toast({
        title: "URL do webhook necessária",
        description: "Por favor, insira a URL do webhook do n8n para continuar.",
        variant: "destructive"
      });
      return;
    }

    if ((activeTab === "style" && !customPrompt) || (activeTab === "reference" && !referenceImage)) {
      toast({
        title: "Informações incompletas",
        description: activeTab === "style" 
          ? "Por favor, selecione um estilo ou forneça um prompt personalizado." 
          : "Por favor, carregue uma imagem de referência.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call to n8n webhook
      // In a real implementation, you would send the prompt or reference image to your n8n webhook
      console.log("Sending to n8n webhook:", {
        url: n8nWebhookUrl,
        prompt: customPrompt,
        referenceImage: referenceImage ? "Base64 image data..." : null,
        mode: activeTab
      });
      
      // Mock response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we're just returning one of the preview images as the "generated" result
      const mockResult = selectedStyle?.previewImage || styleCategories[Math.floor(Math.random() * styleCategories.length)].previewImage;
      setGeneratedImage(mockResult);
      
      toast({
        title: "Background gerado!",
        description: "Seu background foi criado com sucesso.",
      });
    } catch (error) {
      console.error("Error generating background:", error);
      toast({
        title: "Erro ao gerar background",
        description: "Ocorreu um erro ao gerar o background. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `ai-background-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container my-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">AI Background Generator</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Crie backgrounds impressionantes com IA para seus projetos
          </p>
        </div>

        <div className="mb-6">
          <Label htmlFor="n8n-webhook">URL do Webhook (n8n)</Label>
          <Input
            id="n8n-webhook"
            value={n8nWebhookUrl}
            onChange={(e) => setN8nWebhookUrl(e.target.value)}
            placeholder="https://n8n.seu-dominio.com/webhook/ai-background-generator"
            className="mt-1"
          />
          <p className="mt-1 text-sm text-muted-foreground">
            Conecte com seu fluxo de trabalho n8n para gerar as imagens
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Card className="overflow-hidden">
              <Tabs defaultValue="style" onValueChange={(value) => setActiveTab(value as "style" | "reference")}>
                <TabsList className="w-full">
                  <TabsTrigger value="style" className="flex-1">Por Estilo</TabsTrigger>
                  <TabsTrigger value="reference" className="flex-1">Por Referência</TabsTrigger>
                </TabsList>
                <CardContent className="p-6">
                  <TabsContent value="style" className="mt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {styleCategories.map((style) => (
                        <div
                          key={style.id}
                          className={cn(
                            "gradient-card cursor-pointer",
                            selectedStyle?.id === style.id && "ring-2 ring-primary"
                          )}
                          onClick={() => handleStyleSelect(style)}
                        >
                          <div 
                            className="gradient-preview"
                            style={{ backgroundImage: `url(${style.previewImage})`, backgroundSize: 'cover' }}
                          ></div>
                          <div className="p-3">
                            <h3 className="font-medium">{style.name}</h3>
                            <p className="text-xs text-muted-foreground">{style.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-prompt">Prompt Personalizado</Label>
                      <Textarea
                        id="custom-prompt"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Descreva o background que você deseja..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reference" className="mt-0 space-y-4">
                    <div 
                      className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed p-12"
                    >
                      {referenceImage ? (
                        <div className="relative w-full">
                          <img 
                            src={referenceImage} 
                            alt="Reference" 
                            className="mx-auto max-h-40 object-contain"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => setReferenceImage(null)}
                          >
                            Remover Imagem
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                          <h3 className="mt-2 text-lg font-medium">Carregar Imagem de Referência</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Arraste e solte ou clique para selecionar
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            className="mt-4"
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
              
              <div className="border-t bg-muted/40 p-4">
                <Button 
                  className="w-full"
                  onClick={generateBackground}
                  disabled={isGenerating}
                >
                  <Wand className="mr-2 h-4 w-4" />
                  {isGenerating ? "Gerando..." : "Gerar Background"}
                </Button>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className="h-full overflow-hidden">
              <div className="flex h-full flex-col">
                <div className="flex-1 p-6">
                  {generatedImage ? (
                    <div className="relative flex h-full items-center justify-center">
                      <img 
                        src={generatedImage} 
                        alt="Generated Background" 
                        className="max-h-80 w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                      <Wand className="h-12 w-12 text-muted-foreground/60" />
                      <h3 className="mt-4 text-lg font-medium">Seu background aparecerá aqui</h3>
                      <p className="mt-1 text-sm">
                        Selecione um estilo ou carregue uma imagem de referência e clique em gerar
                      </p>
                    </div>
                  )}
                </div>
                
                {generatedImage && (
                  <div className="border-t bg-muted/40 p-4">
                    <Button 
                      variant="secondary" 
                      className="w-full"
                      onClick={downloadImage}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Background
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
        
        <div className="mt-10 rounded-lg bg-muted p-6">
          <h2 className="text-xl font-semibold">Como usar</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>Insira a URL do webhook do n8n que processa as solicitações de imagem.</li>
            <li>Selecione um estilo predefinido ou carregue uma imagem de referência.</li>
            <li>Personalize o prompt de texto para obter resultados específicos.</li>
            <li>Clique em "Gerar Background" e aguarde a criação da imagem.</li>
            <li>Após a geração, você pode baixar a imagem ou gerar outra.</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Nota: Para usar esta ferramenta, você precisará configurar um fluxo de trabalho no n8n que receba o prompt e gere a imagem.
          </p>
        </div>
      </div>
    </div>
  );
}
