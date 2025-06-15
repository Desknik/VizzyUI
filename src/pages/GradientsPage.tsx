import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Download,
  RefreshCw,
  Wand2,
  Palette,
  Circle,
  CircleHelp,
  CircleDot,
  Diamond,
  Triangle,
  TriangleRight,
  Hexagon,
  SquareDot,
  Check,
  Type,
  ArrowUpDown,
  FileCode,
  FileText,
  Square,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface GradientColor {
  color: string;
  position: number;
}

interface GradientPreset {
  name: string;
  colors: GradientColor[];
  angle: number;
}

type GradientType = "linear" | "radial" | "conic" | "complex";
type ColorHarmony =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "splitComplementary";

export default function GradientsPage() {
  const [angle, setAngle] = useState(90);
  const [outputType, setOutputType] = useState<
    "css" | "tailwind" | "text-gradient"
  >("css");
  const [colors, setColors] = useState<GradientColor[]>([
    { color: "#9b87f5", position: 0 },
    { color: "#4EB3AF", position: 100 },
  ]);
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [baseColor, setBaseColor] = useState("#9b87f5");
  const [colorHarmony, setColorHarmony] =
    useState<ColorHarmony>("monochromatic");
  const [currentPalette, setCurrentPalette] = useState<string[]>([]);
  const [currentGradient, setCurrentGradient] = useState("");
  const [sampleText, setSampleText] = useState("Texto com Gradiente");
  const [fontSize, setFontSize] = useState(48);
  const [fontWeight, setFontWeight] = useState(700);
  const [showCopiedIndicator, setShowCopiedIndicator] = useState<string | null>(
    null
  );
  const [isHovering, setIsHovering] = useState(false);
  const [displayMode, setDisplayMode] = useState<"background" | "text">(
    "background"
  );
  const [textColor, setTextColor] = useState("white");

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
  ];

  // Função para converter HSL para HEX
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Função para converter HEX para HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Gerar paletas de cores baseadas em harmonias
  const generateColorPalette = (baseColor: string, harmony: ColorHarmony) => {
    const hsl = hexToHsl(baseColor);
    const colors: string[] = [];

    switch (harmony) {
      case "monochromatic":
        for (let i = 0; i < 6; i++) {
          const lightness = Math.max(10, Math.min(90, hsl.l + (i - 2) * 15));
          colors.push(hslToHex(hsl.h, hsl.s, lightness));
        }
        break;

      case "analogous":
        for (let i = 0; i < 6; i++) {
          const hue = (hsl.h + (i - 2) * 30 + 360) % 360;
          colors.push(hslToHex(hue, hsl.s, hsl.l));
        }
        break;

      case "complementary":
        colors.push(baseColor);
        colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        for (let i = 0; i < 4; i++) {
          const lightness = 20 + i * 20;
          colors.push(hslToHex(hsl.h, hsl.s, lightness));
        }
        break;

      case "triadic":
        colors.push(baseColor);
        colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
        for (let i = 0; i < 3; i++) {
          const lightness = 30 + i * 25;
          colors.push(hslToHex(hsl.h, hsl.s * 0.7, lightness));
        }
        break;

      case "tetradic":
        colors.push(baseColor);
        colors.push(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l));
        colors.push(hslToHex(hsl.h, hsl.s * 0.5, hsl.l * 0.7));
        colors.push(hslToHex(hsl.h, hsl.s * 0.8, hsl.l * 1.2));
        break;

      case "splitComplementary":
        colors.push(baseColor);
        colors.push(hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
        colors.push(hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
        for (let i = 0; i < 3; i++) {
          const lightness = 25 + i * 25;
          colors.push(hslToHex(hsl.h, hsl.s, lightness));
        }
        break;
    }

    return colors;
  };

  // Gerar diferentes tipos de gradientes
  const generateGradientCSS = (colors: string[], type: GradientType) => {
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    const selectedColors = shuffledColors.slice(
      0,
      Math.max(2, Math.min(4, colors.length))
    );

    switch (type) {
      case "linear": {
        const angle = Math.floor(Math.random() * 360);
        return `linear-gradient(${angle}deg, ${selectedColors.join(", ")})`;
      }
      case "radial": {
        const positions = [
          "circle at center",
          "circle at top left",
          "circle at top right",
          "circle at bottom left",
          "circle at bottom right",
        ];
        const position =
          positions[Math.floor(Math.random() * positions.length)];
        return `radial-gradient(${position}, ${selectedColors.join(", ")})`;
      }
      case "conic": {
        const conicAngle = Math.floor(Math.random() * 360);
        return `conic-gradient(from ${conicAngle}deg, ${selectedColors.join(", ")})`;
      }
      case "complex": {
        // Diferentes tipos de gradientes complexos (SEM cônico)
        const complexTypes = [
          // Linear + Radial
          () => {
            const bg1 = `linear-gradient(${Math.floor(
              Math.random() * 360
            )}deg, ${selectedColors.slice(0, 2).join(", ")})`;
            const bg2 = `radial-gradient(circle at ${Math.floor(
              Math.random() * 100
            )}% ${Math.floor(Math.random() * 100)}%, ${selectedColors
              .slice(-2)
              .join(", ")})`;
            return `${bg1}, ${bg2}`;
          },
          // Múltiplos radiais
          () => {
            const bg1 = `radial-gradient(circle at 20% 80%, ${selectedColors[0]}40, transparent 50%)`;
            const bg2 = `radial-gradient(circle at 80% 20%, ${selectedColors[1]}40, transparent 50%)`;
            const bg3 = `radial-gradient(circle at 40% 40%, ${
              selectedColors[2]
            }, ${selectedColors[3] || selectedColors[0]})`;
            return `${bg1}, ${bg2}, ${bg3}`;
          },
          // Linear + Multiple Radials
          () => {
            const bg1 = `linear-gradient(${Math.floor(
              Math.random() * 360
            )}deg, ${selectedColors.slice(0, 2).join("40, ")}40)`;
            const bg2 = `radial-gradient(circle at 25% 25%, ${selectedColors[2]}60, transparent 40%)`;
            const bg3 = `radial-gradient(circle at 75% 75%, ${
              selectedColors[3] || selectedColors[0]
            }60, transparent 40%)`;
            return `${bg1}, ${bg2}, ${bg3}`;
          },
          // Padrão de ondas com linear e radial
          () => {
            const bg1 = `linear-gradient(45deg, ${selectedColors[0]} 25%, transparent 25%)`;
            const bg2 = `linear-gradient(-45deg, ${selectedColors[1]} 25%, transparent 25%)`;
            const bg3 = `radial-gradient(circle, ${selectedColors[2]}, ${selectedColors[0]}80)`;
            return `${bg1}, ${bg2}, ${bg3}`;
          },
        ];

        const randomComplexType =
          complexTypes[Math.floor(Math.random() * complexTypes.length)];
        return randomComplexType();
      }
      default:
        return selectedColors.join(", ");
    }
  };

  // Função principal para gerar gradiente
  const generateGradient = () => {
    const palette = generateColorPalette(baseColor, colorHarmony);
    const gradient = generateGradientCSS(palette, gradientType);

    setCurrentPalette(palette);
    setCurrentGradient(gradient);

    // Converter palette para formato de colors
    const newColors = palette.slice(0, 4).map((color, index) => ({
      color,
      position: (index * 100) / (palette.slice(0, 4).length - 1),
    }));
    setColors(newColors);
  };

  const applyPreset = (preset: GradientPreset) => {
    setColors([...preset.colors]);
    setAngle(preset.angle);
  };

  const getRandomColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  const generateRandomGradient = () => {
    const harmonies: ColorHarmony[] = [
      "monochromatic",
      "analogous",
      "complementary",
      "triadic",
      "tetradic",
      "splitComplementary",
    ];
    const randomHarmony =
      harmonies[Math.floor(Math.random() * harmonies.length)];
    const randomColor = getRandomColor();

    setBaseColor(randomColor);
    setColorHarmony(randomHarmony);

    // Também randomizar o tipo de gradiente
    const types: GradientType[] = ["linear", "radial", "conic", "complex"];
    setGradientType(types[Math.floor(Math.random() * types.length)]);

    setTimeout(() => generateGradient(), 100);
  };

  const generateCSS = () => {
    if (currentGradient) {
      return `background: ${currentGradient};`;
    }

    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors
      .map((color) => `${color.color} ${color.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return `background: linear-gradient(${angle}deg, ${colorStops});`;
    } else if (gradientType === "radial") {
      return `background: radial-gradient(circle, ${colorStops});`;
    } else if (gradientType === "conic") {
      return `background: conic-gradient(from ${angle}deg, ${colorStops});`;
    } else {
      return `background: ${
        currentGradient || `linear-gradient(${angle}deg, ${colorStops})`
      };`;
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
      return `/* Tailwind CSS não tem classes nativas para gradientes ${gradientType}s */
/* Use a versão CSS abaixo */
${generateCSS()}`;
    }
  };

  const generateTextGradient = () => {
    const css = generateCSS();
    return `
/* CSS */
${css}
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;

/* Para uso em texto */
.gradient-text {
  ${css}
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;
  };

  const generateTailwindTextGradient = () => {
    const sortedColors = [...colors].sort((a, b) => a.position - b.position);

    if (gradientType === "linear") {
      let direction = "to-r";
      if (angle >= 45 && angle < 135) direction = "to-b";
      else if (angle >= 135 && angle < 225) direction = "to-l";
      else if (angle >= 225 && angle < 315) direction = "to-t";

      return `bg-gradient-${direction} from-[${sortedColors[0].color}] ${
        sortedColors.length > 2 ? `via-[${sortedColors[1].color}] ` : ""
      }to-[${
        sortedColors[sortedColors.length - 1].color
      }] text-transparent bg-clip-text`;
    } else {
      return `/* Tailwind não suporta gradientes ${gradientType}s para texto diretamente */
/* Use classes utilitárias e estilos personalizados */
bg-clip-text text-transparent [background:${
        currentGradient || getGradientBackgroundValue()
      }]`;
    }
  };

  const copyToClipboard = (type: string = outputType) => {
    let code;
    if (type === "css") {
      code = generateCSS();
    } else if (type === "tailwind") {
      code = generateTailwind();
    } else if (type === "text-gradient") {
      code = generateTextGradient();
    } else if (type === "text-tailwind") {
      code = generateTailwindTextGradient();
    }

    navigator.clipboard.writeText(code || "");
    setShowCopiedIndicator(type);

    setTimeout(() => {
      setShowCopiedIndicator(null);
    }, 2000);
  };

  const downloadGradient = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      let gradient;
      const sortedColors = [...colors].sort((a, b) => a.position - b.position);

      if (gradientType === "linear" || gradientType === "complex") {
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      } else if (gradientType === "radial") {
        gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        );
      } else {
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

  const getGradientBackgroundValue = () => {
    if (currentGradient) {
      return currentGradient;
    }

    const sortedColors = [...colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors
      .map((color) => `${color.color} ${color.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${colorStops})`;
    } else if (gradientType === "radial") {
      return `radial-gradient(circle, ${colorStops})`;
    } else if (gradientType === "conic") {
      return `conic-gradient(from ${angle}deg, ${colorStops})`;
    } else {
      return currentGradient || `linear-gradient(${angle}deg, ${colorStops})`;
    }
  };

  const getGradientStyle = () => {
    return {
      background: getGradientBackgroundValue(),
    };
  };

  const getHoverGradientStyle = () => {
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const baseOverlay = isDarkMode
      ? "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))"
      : "linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))";

    return {
      background: `${baseOverlay}, ${getGradientBackgroundValue()}`,
      transition: "all 0.3s ease",
    };
  };

  const getBackgroundGradientStyle = () => {
    return {
      background: getGradientBackgroundValue(),
    };
  };

  const getTextGradientContainerStyle = () => {
    return {
      background: "linear-gradient(135deg, #ffffff, #d8d0fb)",
    };
  };

  // CORREÇÃO PRINCIPAL: Função corrigida para texto com gradiente
  const getTextGradientStyle = () => {
    return {
      background: getGradientBackgroundValue(),
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      lineHeight: 1.2,
      // Adiciona propriedades para garantir que o gradiente funcione
      display: "inline-block",
      backgroundSize: "100% 100%",
    };
  };

  const toggleDisplayMode = () => {
    setDisplayMode((prev) => (prev === "background" ? "text" : "background"));
  };

  const calculateTextColor = () => {
    if (gradientType === "complex" || !colors.length) {
      return "white";
    }

    let totalBrightness = 0;
    for (const { color } of colors) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      totalBrightness += brightness;
    }

    const avgBrightness = totalBrightness / colors.length;
    return avgBrightness > 128 ? "rgba(0,0,0,0.8)" : "white";
  };

  useEffect(() => {
    setTextColor(calculateTextColor());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, gradientType, currentGradient]);

  const getHarmonyName = (harmony: ColorHarmony) => {
    const names = {
      monochromatic: "Monocromática",
      analogous: "Análoga",
      complementary: "Complementar",
      triadic: "Tríade",
      tetradic: "Tetrádica",
      splitComplementary: "Split-Complementar",
    };
    return names[harmony] || harmony;
  };

  const getTypeName = (type: GradientType) => {
    const names = {
      linear: "Linear",
      radial: "Radial",
      conic: "Cônico",
      complex: "Complexo",
    };
    return names[type];
  };

  return (
    <div className="container my-8">
      <div className="mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Gerador de Gradientes
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Crie gradientes impressionantes para seus projetos
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gerador Inteligente</CardTitle>
                <CardDescription>
                  Selecione uma cor base e harmonia para gerar gradientes
                  automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cor Base */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Cor Base
                  </Label>
                  <div className="relative flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-full border-2 border-input shadow-sm cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: baseColor }}
                      onClick={() =>
                        document.getElementById("baseColorInput")?.click()
                      }
                    />
                    <div className="absolute top-full mt-2">
                      <Input
                        id="baseColorInput"
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        className="h-12 w-20 cursor-pointer hidden"
                      />
                    </div>
                    <Input
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="flex-1 font-mono "
                      placeholder="#9b87f5"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Harmonia de Cores */}
                  <div className="w-full">
                    <Label className="text-sm font-medium mb-3 block">
                      Harmonia de Cores
                    </Label>
                    <Select
                      value={colorHarmony}
                      onValueChange={(value: ColorHarmony) =>
                        setColorHarmony(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a harmonia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monochromatic">
                          <div className="flex items-center gap-2">
                            <CircleHelp className="h-4 w-4" />
                            Monocromática
                          </div>
                        </SelectItem>
                        <SelectItem value="analogous">
                          <div className="flex items-center gap-2">
                            <CircleDot className="h-4 w-4" />
                            Análoga
                          </div>
                        </SelectItem>
                        <SelectItem value="complementary">
                          <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4" />
                            Complementar
                          </div>
                        </SelectItem>
                        <SelectItem value="triadic">
                          <div className="flex items-center gap-2">
                            <Triangle className="h-4 w-4" />
                            Tríade
                          </div>
                        </SelectItem>
                        <SelectItem value="tetradic">
                          <div className="flex items-center gap-2">
                            <Diamond className="h-4 w-4" />
                            Tetrádica
                          </div>
                        </SelectItem>
                        <SelectItem value="splitComplementary">
                          <div className="flex items-center gap-2">
                            <TriangleRight className="h-4 w-4" />
                            Split-Complementar
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo de Gradiente */}
                  <div className="w-full">
                    <Label className="text-sm font-medium mb-3 block">
                      Tipo de Gradiente
                    </Label>
                    <Select
                      value={gradientType}
                      onValueChange={(value: GradientType) =>
                        setGradientType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                        <SelectItem value="conic">Cônico</SelectItem>
                        <SelectItem value="complex">
                          Complexo (Linear + Radial)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Paleta de Cores Gerada */}
                {currentPalette.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Paleta Gerada
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {currentPalette.map((color, index) => (
                        <div
                          key={index}
                          className="h-12 w-12 rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                          title={color}
                          onClick={() => navigator.clipboard.writeText(color)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Ângulo para Linear/Cônico */}
                {(gradientType === "linear" || gradientType === "conic") && (
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Ângulo: {angle}°
                    </Label>
                    <Slider
                      value={[angle]}
                      min={0}
                      max={360}
                      step={1}
                      onValueChange={(value) => setAngle(value[0])}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button onClick={generateGradient} className="flex-1">
                  <Palette className="mr-2 h-4 w-4" />
                  Gerar Gradiente
                </Button>
                <Button variant="outline" onClick={generateRandomGradient}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Aleatório
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-fit overflow-hidden">
              <div
                className={cn(
                  "h-48 sm:h-64 w-full relative rounded-t-lg overflow-hidden transition-all duration-500 ease-out",
                  displayMode === "background" ? "group" : ""
                )}
                style={
                  displayMode === "background"
                    ? getBackgroundGradientStyle()
                    : getTextGradientContainerStyle()
                }
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {displayMode === "text" ? (
                    // MODO TEXTO: Sempre aplica o gradiente ao texto
                    <div
                      className="text-center transition-all duration-500 ease-out transform opacity-100 scale-100"
                      style={{
                        textShadow:
                          "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                        transition: "all 0.5s ease-out",
                      }}
                    >
                      <div
                        className="text-lg font-semibold"
                        style={getTextGradientStyle()}
                      >
                        {getTypeName(gradientType)}
                      </div>
                      <div
                        className="text-sm opacity-90"
                        style={getTextGradientStyle()}
                      >
                        {getHarmonyName(colorHarmony)}
                      </div>
                    </div>
                  ) : (
                    // MODO BACKGROUND: Mostra texto normal quando hover
                    isHovering && (
                      <div
                        className="text-center transition-all duration-500 ease-out transform drop-shadow-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                        style={{
                          color: textColor,
                          textShadow:
                            "0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <div className="text-lg font-semibold">
                          {getTypeName(gradientType)}
                        </div>
                        <div className="text-sm opacity-90">
                          {getHarmonyName(colorHarmony)}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={toggleDisplayMode}
                    className={cn(
                      "backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105",
                      displayMode === "text"
                        ? "bg-black/10 hover:bg-black/20 text-gray-800 hover:text-gray-900"
                        : "bg-white/20 hover:bg-white/30 text-white hover:text-white"
                    )}
                    title={
                      displayMode === "background"
                        ? "Mostrar texto com gradiente"
                        : "Mostrar gradiente"
                    }
                  >
                    {displayMode === "background" ? (
                      <Type className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={generateGradient}
                    className={cn(
                      "backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105",
                      displayMode === "text"
                        ? "bg-black/10 hover:bg-black/20 text-gray-800 hover:text-gray-900"
                        : "bg-white/20 hover:bg-white/30 text-white hover:text-white"
                    )}
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardFooter className="flex gap-2 p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Código
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Escolha o formato</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                        Gradiente para Background
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard("css")}
                        className="transition-colors duration-200"
                      >
                        <FileCode className="mr-2 h-4 w-4" />
                        <span>CSS</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard("tailwind")}
                        className="transition-colors duration-200"
                      >
                        <FileCode className="mr-2 h-4 w-4" />
                        <span>Tailwind CSS</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                        Gradiente para Texto
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard("text-gradient")}
                        className="transition-colors duration-200"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>CSS</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard("text-tailwind")}
                        className="transition-colors duration-200"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Tailwind CSS</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={downloadGradient}
                  className="flex-1 transition-all duration-200 hover:scale-[1.02]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}