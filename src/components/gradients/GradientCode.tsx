
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { GradientColor } from "./ColorPalette";

interface GradientCodeProps {
  colors: GradientColor[];
  angle: number;
}

export const GradientCode: React.FC<GradientCodeProps> = ({ colors, angle }) => {
  const { toast } = useToast();
  const [outputType, setOutputType] = React.useState<"css" | "tailwind" | "text-gradient">("css");

  const generateCSS = () => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map((color) => `${color.color} ${color.position}%`).join(", ");
    return `background: linear-gradient(${angle}deg, ${colorStops});`;
  };

  const generateTailwind = () => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    
    let direction = "to-r";
    if (angle >= 45 && angle < 135) direction = "to-b";
    else if (angle >= 135 && angle < 225) direction = "to-l";
    else if (angle >= 225 && angle < 315) direction = "to-t";
    
    return `bg-gradient-${direction} from-[${sortedColors[0].color}] ${
      sortedColors.length > 2 ? `via-[${sortedColors[1].color}] ` : ""
    }to-[${sortedColors[sortedColors.length - 1].color}]`;
  };

  const generateTextGradient = () => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map((color) => `${color.color} ${color.position}%`).join(", ");
    
    const gradientCSS = `linear-gradient(${angle}deg, ${colorStops})`;
    
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

  return (
    <div>
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
      
      <div className="mt-4 flex justify-end">
        <Button variant="secondary" onClick={copyToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          Copiar
        </Button>
      </div>
    </div>
  );
};
