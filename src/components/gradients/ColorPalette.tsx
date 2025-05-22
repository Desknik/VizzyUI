
import React from "react";

export interface GradientColor {
  color: string;
  position: number;
}

interface ColorPaletteProps {
  colors: GradientColor[];
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  if (!colors.length) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-2 font-medium">Paleta de Cores</h3>
      <div className="flex justify-between">
        {colors.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="h-8 w-8 rounded-full border shadow-sm" 
              style={{ backgroundColor: color.color }}
            />
            <span className="text-xs mt-1 text-muted-foreground">{color.color}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
