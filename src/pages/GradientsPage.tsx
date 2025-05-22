
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Copy, Download, RefreshCw, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GradientColor {
  color: string;
  position: number;
}

interface GradientPreset {
  name: string;
  colors: GradientColor[];
  angle: number;
}

type GradientType = "linear" | "radial" | "conic";

export default function GradientsPage() {
  const { toast } = useToast();
  const [angle, setAngle] = useState(90);
  const [outputType, setOutputType] = useState<"css" | "tailwind" | "text-gradient">("css");
  const [colors, setColors] = useState<GradientColor[]>([
    { color: "#9b87f5", position: 0 },
    { color: "#4EB3AF", position: 100 },
  ]);
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [editorMode, setEditorMode] = useState<"simple" | "advanced">("simple");
  
  // Simple editor state
  const [baseColor, setBaseColor] = useState("#9b87f5");
  const [colorGap, setColorGap] = useState(30);
  const [saturation, setSaturation] = useState(80);

  const gradientPresets: GradientPreset[] = [
    {
      name: "Roxo ao Teal",
      colors: [
        { color: "#9b87f5", position: 0 },
        { color: "#4EB3AF", position: 100 },
      ],
      angle: 90,
    },
    {
      name: "Pôr do Sol",
      colors: [
        { color: "#FF9A8B", position: 0 },
        { color: "#FF6A88", position: 60 },
        { color: "#FF99AC", position: 100 },
      ],
      angle: 45,
    },
    {
      name: "Oceano Profundo",
      colors: [
        { color: "#0F2027", position: 0 },
        { color: "#203A43", position: 50 },
        { color: "#2C5364", position: 100 },
      ],
      angle: 180,
    },
    {
      name: "Aurora Boreal",
      colors: [
        { color: "#4facfe", position: 0 },
        { color: "#00f2fe", position: 100 },
      ],
      angle: 135,
    },
    {
      name: "Verão Tropical",
      colors: [
        { color: "#ff9a9e", position: 0 },
        { color: "#fad0c4", position: 100 },
      ],
      angle: 90,
    },
    {
      name: "Limão e Menta",
      colors: [
        { color: "#a8ff78", position: 0 },
        { color: "#78ffd6", position: 100 },
      ],
      angle: 60,
    },
  ];

  const applyPreset = (preset: GradientPreset) => {
    setColors([...preset.colors]);
    setAngle(preset.angle);
    setEditorMode("advanced");
    toast({
      title: "Preset aplicado",
      description: `Gradiente "${preset.name}" aplicado com sucesso.`,
    });
  };

  const addColor = () => {
    if (colors.length < 5) {
      const newColor = {
        color: getRandomColor(),
        position: 50,
      };
      setColors([...colors, newColor]);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = [...colors];
      newColors.splice(index, 1);
      setColors(newColors);
    }
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index].color = color;
    setColors(newColors);
  };

  const updatePosition = (index: number, position: number) => {
    const newColors = [...colors];
    newColors[index].position = position;
    setColors(newColors);
  };

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  };

  const generateRandomGradient = () => {
    const numberOfColors = Math.floor(Math.random() * 3) + 2; // 2-4 colors
    const newColors: GradientColor[] = [];
    
    for (let i = 0; i < numberOfColors; i++) {
      newColors.push({
        color: getRandomColor(),
        position: i === 0 ? 0 : i === numberOfColors - 1 ? 100 : Math.floor(Math.random() * 80) + 10,
      });
    }
    
    // Sort by position
    newColors.sort((a, b) => a.position - b.position);
    
    setColors(newColors);
    setAngle(Math.floor(Math.random() * 360));
  };

  const changeGradientType = () => {
    const types: GradientType[] = ["linear", "radial", "conic"];
    const currentIndex = types.indexOf(gradientType);
    const nextIndex = (currentIndex + 1) % types.length;
    setGradientType(types[nextIndex]);
  };

  const generateCSS = () => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map((color) => `${color.color} ${color.position}%`).join(", ");
    
    if (gradientType === "linear") {
      return `background: linear-gradient(${angle}deg, ${colorStops});`;
    } else if (gradientType === "radial") {
      return `background: radial-gradient(circle, ${colorStops});`;
    } else {
      return `background: conic-gradient(from ${angle}deg, ${colorStops});`;
    }
  };

  const generateTailwind = () => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    
    if (gradientType === "linear") {
      let direction = "to-r";
      if (angle >= 45 && angle < 135) direction = "to-b";
      else if (angle >= 135 && angle < 225) direction = "to-l";
      else if (angle >= 225 && angle < 315) direction = "to-t";
      
      return `bg-gradient-${direction} from-[${sortedColors[0].color}] ${
        sortedColors.length > 2 ? `via-[${sortedColors[1].color}] ` : ""
      }to-[${sortedColors[sortedColors.length - 1].color}]`;
    } else {
      // Tailwind doesn't have built-in classes for radial/conic gradients
      // so return a note about using the CSS version
      return `/* Tailwind CSS não tem classes nativas para gradientes ${gradientType}s */
/* Use a versão CSS abaixo com a classe 'bg-[image:...]' */
bg-[image:${gradientType}-gradient(${gradientType === "radial" ? "circle" : `from ${angle}deg`}, ${sortedColors.map(c => `${c.color} ${c.position}%`).join(", ")})]`;
    }
  };

  const generateTextGradient = () => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map((color) => `${color.color} ${color.position}%`).join(", ");
    
    let gradientCSS = "";
    if (gradientType === "linear") {
      gradientCSS = `linear-gradient(${angle}deg, ${colorStops})`;
    } else if (gradientType === "radial") {
      gradientCSS = `radial-gradient(circle, ${colorStops})`;
    } else {
      gradientCSS = `conic-gradient(from ${angle}deg, ${colorStops})`;
    }
    
    return `
/* CSS */
background: ${gradientCSS};
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Tailwind */
bg-clip-text text-transparent bg-[image:${gradientCSS}]
`;
  };

  const copyToClipboard = () => {
    let code;
    if (outputType === "css") {
      code = generateCSS();
    } else if (outputType === "tailwind") {
      code = generateTailwind();
    } else {
      code = generateTextGradient();
    }
    
    navigator.clipboard.writeText(code);
    toast({
      title: "Copiado!",
      description: "O código foi copiado para a área de transferência.",
    });
  };

  const downloadGradient = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      let gradient;
      const sortedColors = [...colors].sort((a, b) => a.position - b.position);
      
      if (gradientType === "linear") {
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      } else if (gradientType === "radial") {
        gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
      } else {
        // For conic gradient, we need to use a workaround since there's no native conic gradient
        // We'll simulate it by creating many small linear gradients
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      }
      
      sortedColors.forEach((color) => {
        gradient.addColorStop(color.position / 100, color.color);
      });
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const link = document.createElement("a");
      link.download = `gradient-${gradientType}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  // Function to generate a palette from a base color
  const generatePaletteFromColor = () => {
    const hslToHex = (h: number, s: number, l: number) => {
      h = h % 360;
      s = s / 100;
      l = l / 100;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(4)}${f(8)}`;
    };

    // Convert hex to HSL
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h *= 60;
      }
      
      return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
    };

    const [h, s, l] = hexToHsl(baseColor);
    
    const newColors: GradientColor[] = [];
    const steps = 5;
    
    for (let i = 0; i < steps; i++) {
      const position = (i * 100) / (steps - 1);
      const hue = (h + i * colorGap) % 360;
      newColors.push({
        color: hslToHex(hue, Math.min(100, s + saturation - 80), l),
        position,
      });
    }
    
    setColors(newColors);
    setEditorMode("advanced");
  };

  const gradientStyle = {
    background: gradientType === "linear"
      ? `linear-gradient(${angle}deg, ${colors
          .map((color) => `${color.color} ${color.position}%`)
          .join(", ")})`
      : gradientType === "radial"
      ? `radial-gradient(circle, ${colors
          .map((color) => `${color.color} ${color.position}%`)
          .join(", ")})`
      : `conic-gradient(from ${angle}deg, ${colors
          .map((color) => `${color.color} ${color.position}%`)
          .join(", ")})`,
  };

  // Calculate if text should be white or black based on gradient darkness
  const getTextColor = (colors: GradientColor[]) => {
    // Simple approach: Check if the average color is dark
    const isColorDark = (hex: string) => {
      const r = parseInt(hex.substring(1, 3), 16);
      const g = parseInt(hex.substring(3, 5), 16);
      const b = parseInt(hex.substring(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    };
    
    // Count how many colors are dark
    const darkCount = colors.filter(c => isColorDark(c.color)).length;
    return darkCount > colors.length / 2 ? "text-white" : "text-black";
  };

  return (
    <div className="container my-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Gerador de Gradientes</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Crie gradientes impressionantes para seus projetos
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Personalizar Gradiente</CardTitle>
                <CardDescription>
                  Ajuste as cores e o ângulo para criar seu gradiente perfeito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="simple" onValueChange={(value) => setEditorMode(value as "simple" | "advanced")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="simple">Simples</TabsTrigger>
                    <TabsTrigger value="advanced">Avançado</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="simple" className="space-y-6">
                    <div>
                      <h3 className="mb-2 font-medium">Cor Base</h3>
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-8 w-8 rounded-full border" 
                          style={{ backgroundColor: baseColor }}
                        />
                        <Input
                          type="color"
                          value={baseColor}
                          onChange={(e) => setBaseColor(e.target.value)}
                          className="h-10 w-20"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Distância entre Cores: {colorGap}°</h3>
                      <Slider
                        value={[colorGap]}
                        min={10}
                        max={90}
                        step={1}
                        onValueChange={(value) => setColorGap(value[0])}
                      />
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Saturação: {saturation}%</h3>
                      <Slider
                        value={[saturation]}
                        min={40}
                        max={120}
                        step={1}
                        onValueChange={(value) => setSaturation(value[0])}
                      />
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={generatePaletteFromColor}
                    >
                      Gerar Paleta
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-6">
                    <div>
                      <div className="mb-4 flex justify-between">
                        <h3 className="font-medium">Cores</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addColor} 
                          disabled={colors.length >= 5}
                        >
                          Adicionar Cor
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {colors.map((color, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div 
                              className="h-8 w-8 rounded-full border" 
                              style={{ backgroundColor: color.color }}
                            />
                            <Input
                              type="color"
                              value={color.color}
                              onChange={(e) => updateColor(index, e.target.value)}
                              className="h-10 w-20"
                            />
                            <div className="flex-1">
                              <Slider
                                value={[color.position]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={(value) => updatePosition(index, value[0])}
                              />
                            </div>
                            <div className="w-12 text-center text-sm">
                              {color.position}%
                            </div>
                            {colors.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeColor(index)}
                                className="h-8 w-8 p-0"
                              >
                                &times;
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Ângulo: {angle}°</h3>
                      <Slider
                        value={[angle]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(value) => setAngle(value[0])}
                      />
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={generateRandomGradient}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Gerar Aleatório
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full">
              <div className="h-40 w-full relative" style={gradientStyle}>
                {/* Preview without name */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-white/70 backdrop-blur-sm hover:bg-white"
                    onClick={changeGradientType}
                    title="Alterar tipo de gradiente"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <Select value={gradientType} onValueChange={(value) => setGradientType(value as GradientType)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tipo de Gradiente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                      <SelectItem value="conic">Cônico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Tabs defaultValue="css" onValueChange={(value) => setOutputType(value as "css" | "tailwind" | "text-gradient")}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                    <TabsTrigger value="text-gradient">Text</TabsTrigger>
                  </TabsList>
                  <TabsContent value="css" className="mt-4">
                    <pre className="rounded-md bg-muted p-4 text-sm">
                      {generateCSS()}
                    </pre>
                  </TabsContent>
                  <TabsContent value="tailwind" className="mt-4">
                    <pre className="rounded-md bg-muted p-4 text-sm">
                      {generateTailwind()}
                    </pre>
                  </TabsContent>
                  <TabsContent value="text-gradient" className="mt-4">
                    <pre className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
                      {generateTextGradient()}
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="secondary" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar
                </Button>
                <Button onClick={downloadGradient}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Gradientes Pré-definidos</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {gradientPresets.map((preset, index) => {
              const gradientCSS = {
                background: `linear-gradient(${preset.angle}deg, ${preset.colors
                  .map((color) => `${color.color} ${color.position}%`)
                  .join(", ")})`,
              };
              const textColorClass = getTextColor(preset.colors);
              
              return (
                <Card 
                  key={index} 
                  className="gradient-card overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  onClick={() => applyPreset(preset)}
                >
                  <div 
                    className="gradient-preview h-24 w-full relative" 
                    style={gradientCSS}
                  >
                    <div className={`gradient-name ${textColorClass} text-2xl`} style={{ 
                        backgroundImage: `linear-gradient(${preset.angle}deg, ${preset.colors
                          .map((color) => `${color.color} ${color.position}%`)
                          .join(", ")})`
                      }}>
                      {preset.name}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
