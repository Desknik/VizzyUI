
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download, RefreshCw, Palette } from "lucide-react";
import { GradientControls, ColorHarmony } from "@/components/gradients/GradientControls";
import { ColorPalette, GradientColor } from "@/components/gradients/ColorPalette";
import { ArtisticGradient } from "@/components/gradients/ArtisticGradient";
import { GradientCode } from "@/components/gradients/GradientCode";
import { generateColorPalette } from "@/utils/colorUtils";

export default function GradientsPage() {
  const { toast } = useToast();
  
  // Control state
  const [baseColor, setBaseColor] = useState("#9b87f5");
  const [colorHarmony, setColorHarmony] = useState<ColorHarmony>("shades");
  const [hueRange, setHueRange] = useState(30);
  const [saturation, setSaturation] = useState(80);
  
  // Palette and gradient state
  const [colors, setColors] = useState<GradientColor[]>(
    generateColorPalette(baseColor, colorHarmony, hueRange, saturation)
  );
  const [gradientAngle] = useState(90); // Still needed for CSS output
  const [seed, setSeed] = useState(Math.random());
  
  // Generate a new palette based on current settings
  const generatePalette = () => {
    const newColors = generateColorPalette(baseColor, colorHarmony, hueRange, saturation);
    setColors(newColors);
    toast({
      title: "Paleta gerada",
      description: `Paleta de cores baseada em ${colorHarmony} gerada com sucesso.`,
    });
  };
  
  // Generate a new random artistic pattern with the same palette
  const generateRandomPattern = () => {
    setSeed(Math.random());
    toast({
      title: "Padrão atualizado",
      description: "Um novo padrão de gradiente foi gerado com as mesmas cores.",
    });
  };
  
  // Download gradient as an image
  const downloadGradient = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement("a");
    link.download = `artistic-gradient.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    
    toast({
      title: "Download iniciado",
      description: "Sua imagem está sendo baixada.",
    });
  };
  
  // Create a ref to access the canvas for downloading
  const canvasRef = {
    current: document.querySelector("canvas")
  };
  
  return (
    <div className="container my-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Gerador de Gradientes Artísticos</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Crie gradientes impressionantes com aspecto de pintura digital
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Controls Column */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Personalizar Gradiente</CardTitle>
                <CardDescription>
                  Ajuste as cores e harmonias para criar seu gradiente perfeito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientControls 
                  baseColor={baseColor}
                  colorHarmony={colorHarmony}
                  hueRange={hueRange}
                  saturation={saturation}
                  onBaseColorChange={setBaseColor}
                  onColorHarmonyChange={setColorHarmony}
                  onHueRangeChange={setHueRange}
                  onSaturationChange={setSaturation}
                />
                
                <ColorPalette colors={colors} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={generateRandomPattern}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Novo Padrão
                </Button>
                <Button 
                  onClick={generatePalette}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Gerar Paleta
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Gradient Preview Column */}
          <div className="md:col-span-3">
            <Card className="h-full">
              <div className="relative">
                <ArtisticGradient 
                  colors={colors} 
                  width={640} 
                  height={320}
                  seed={seed}
                />
                <Button
                  onClick={downloadGradient}
                  className="absolute bottom-4 right-4"
                  variant="secondary"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <CardContent className="pt-6">
                <h3 className="mb-2 font-medium">Código para Gradiente Linear</h3>
                <GradientCode colors={colors} angle={gradientAngle} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
