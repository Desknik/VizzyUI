
import React, { useRef, useEffect } from "react";
import { GradientColor } from "./ColorPalette";

interface ArtisticGradientProps {
  colors: GradientColor[];
  width?: number;
  height?: number;
  seed?: number;
}

export const ArtisticGradient: React.FC<ArtisticGradientProps> = ({ 
  colors,
  width = 640,
  height = 400,
  seed = Math.random()
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || colors.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale context according to device pixel ratio
    ctx.scale(dpr, dpr);
    
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);
    
    // Create a painterly, blended effect with radial gradients
    drawArtisticGradient(ctx, width, height, colors, seed);
    
  }, [colors, width, height, seed]);
  
  // Function to create an artistic, painterly gradient
  const drawArtisticGradient = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    colors: GradientColor[],
    seed: number
  ) => {
    // We'll use a seeded random for deterministic randomness
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed++) * 10000;
      const rand = x - Math.floor(x);
      return min + rand * (max - min);
    };
    
    // First, paint a background with the first color
    ctx.fillStyle = colors[0].color;
    ctx.fillRect(0, 0, width, height);
    
    // Create between 20-30 radial gradients with varying sizes and opacities
    const numGradients = Math.floor(seededRandom(20, 30));
    
    for (let i = 0; i < numGradients; i++) {
      // Pick a random color from our palette
      const colorIndex = Math.floor(seededRandom(0, colors.length));
      const color = colors[colorIndex].color;
      
      // Random position within the canvas, with some padding from edges
      const padding = Math.min(width, height) * 0.1;
      const x = seededRandom(padding, width - padding);
      const y = seededRandom(padding, height - padding);
      
      // Random radius between 10% and 40% of the canvas size
      const minDimension = Math.min(width, height);
      const radius = seededRandom(minDimension * 0.1, minDimension * 0.4);
      
      // Create a radial gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      
      // Add color stops with randomized opacity
      const opacity = seededRandom(0.2, 0.8);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Fade to transparent
      
      // Apply gradient as a layer
      ctx.globalAlpha = opacity;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Reset global alpha
    ctx.globalAlpha = 1.0;
    
    // Optional: Add some texture/noise over the gradient
    addNoiseTexture(ctx, width, height, 0.03, seed);
  };
  
  // Function to add subtle noise texture
  const addNoiseTexture = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    opacity: number,
    seed: number
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // We'll use a seeded random for deterministic randomness
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    
    // Add noise to each pixel
    for (let i = 0; i < data.length; i += 4) {
      const noise = (seededRandom() - 0.5) * opacity * 255;
      
      data[i] = Math.max(0, Math.min(255, data[i] + noise));       // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <canvas
        ref={canvasRef}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          maxWidth: '100%',
          objectFit: 'contain'
        }}
        className="rounded-lg shadow-md"
      />
    </div>
  );
};
