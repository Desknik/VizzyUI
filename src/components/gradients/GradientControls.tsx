
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Circle, CircleHelp, CircleDot, Diamond, Triangle, TriangleRight, Hexagon, SquareDot } from "lucide-react";

export type ColorHarmony = "shades" | "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "square" | "rectangular";

interface GradientControlsProps {
  baseColor: string;
  colorHarmony: ColorHarmony;
  hueRange: number;
  saturation: number;
  onBaseColorChange: (color: string) => void;
  onColorHarmonyChange: (harmony: ColorHarmony) => void;
  onHueRangeChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
}

export const GradientControls = ({
  baseColor,
  colorHarmony,
  hueRange,
  saturation,
  onBaseColorChange,
  onColorHarmonyChange,
  onHueRangeChange,
  onSaturationChange
}: GradientControlsProps) => {
  return (
    <div className="space-y-6">
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
            onChange={(e) => onBaseColorChange(e.target.value)}
            className="h-10 w-20"
          />
        </div>
      </div>
      
      <div>
        <h3 className="mb-2 font-medium">Tipo de Harmonia de Cores</h3>
        <RadioGroup 
          className="grid grid-cols-2 gap-2"
          value={colorHarmony}
          onValueChange={(value) => onColorHarmonyChange(value as ColorHarmony)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="shades" id="shades" />
            <Label htmlFor="shades" className="flex items-center gap-1">
              <CircleHelp className="h-4 w-4" /> Tons
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="complementary" id="complementary" />
            <Label htmlFor="complementary" className="flex items-center gap-1">
              <Circle className="h-4 w-4" /> Complementar
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="analogous" id="analogous" />
            <Label htmlFor="analogous" className="flex items-center gap-1">
              <CircleDot className="h-4 w-4" /> Análogas
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="triadic" id="triadic" />
            <Label htmlFor="triadic" className="flex items-center gap-1">
              <Triangle className="h-4 w-4" /> Tríades
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="split-complementary" id="split-complementary" />
            <Label htmlFor="split-complementary" className="flex items-center gap-1">
              <TriangleRight className="h-4 w-4" /> Split Complementar
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tetradic" id="tetradic" />
            <Label htmlFor="tetradic" className="flex items-center gap-1">
              <Diamond className="h-4 w-4" /> Tetrádica
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="square" id="square" />
            <Label htmlFor="square" className="flex items-center gap-1">
              <SquareDot className="h-4 w-4" /> Quadrado
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rectangular" id="rectangular" />
            <Label htmlFor="rectangular" className="flex items-center gap-1">
              <Hexagon className="h-4 w-4" /> Retangular
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="mb-2 font-medium">Variação de Cores: {hueRange}°</h3>
        <Slider
          value={[hueRange]}
          min={10}
          max={90}
          step={1}
          onValueChange={(value) => onHueRangeChange(value[0])}
        />
      </div>
      
      <div>
        <h3 className="mb-2 font-medium">Saturação: {saturation}%</h3>
        <Slider
          value={[saturation]}
          min={40}
          max={120}
          step={1}
          onValueChange={(value) => onSaturationChange(value[0])}
        />
      </div>
    </div>
  );
};
