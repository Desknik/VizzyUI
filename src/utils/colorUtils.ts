
// Function to convert hex to HSL
export const hexToHsl = (hex: string) => {
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

// Function to convert HSL to Hex
export const hslToHex = (h: number, s: number, l: number) => {
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

// Get a random color in hex format
export const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

// Function to generate an array of colors based on a harmony
export const generateColorPalette = (
  baseColor: string, 
  harmony: string,
  hueRange: number = 30,
  saturation: number = 80
) => {
  const [h, s, l] = hexToHsl(baseColor);
  
  switch (harmony) {
    case "shades":
      // Generate different shades/tints of the same color
      return Array.from({ length: 5 }, (_, i) => {
        const position = (i * 100) / 4;
        const lightness = Math.max(10, Math.min(90, l - 30 + (i * 15)));
        return {
          color: hslToHex(h, Math.min(100, s + saturation - 80), lightness),
          position,
        };
      });
    
    case "complementary":
      // Base color and its complement (opposite on color wheel)
      return [
        { color: baseColor, position: 0 },
        { color: hslToHex((h + 180) % 360, Math.min(100, s + saturation - 80), l), position: 100 }
      ];
    
    case "analogous":
      // Colors adjacent to each other on the color wheel
      return Array.from({ length: 5 }, (_, i) => {
        const position = (i * 100) / 4;
        const hue = (h + (i - 2) * hueRange) % 360;
        return {
          color: hslToHex(hue, Math.min(100, s + saturation - 80), l),
          position,
        };
      });
    
    case "triadic":
      // Three colors evenly spaced on the color wheel (120° apart)
      return [
        { color: baseColor, position: 0 },
        { color: hslToHex((h + 120) % 360, Math.min(100, s + saturation - 80), l), position: 50 },
        { color: hslToHex((h + 240) % 360, Math.min(100, s + saturation - 80), l), position: 100 }
      ];
    
    case "split-complementary":
      // Base color and two colors adjacent to its complement
      return [
        { color: baseColor, position: 0 },
        { color: hslToHex((h + 150) % 360, Math.min(100, s + saturation - 80), l), position: 50 },
        { color: hslToHex((h + 210) % 360, Math.min(100, s + saturation - 80), l), position: 100 }
      ];
    
    case "tetradic":
      // Four colors evenly spaced on the color wheel
      return [
        { color: baseColor, position: 0 },
        { color: hslToHex((h + 90) % 360, Math.min(100, s + saturation - 80), l), position: 33 },
        { color: hslToHex((h + 180) % 360, Math.min(100, s + saturation - 80), l), position: 67 },
        { color: hslToHex((h + 270) % 360, Math.min(100, s + saturation - 80), l), position: 100 }
      ];
    
    case "square":
      // Four colors spaced 90° apart on the color wheel
      return [
        { color: baseColor, position: 0 },
        { color: hslToHex((h + 90) % 360, Math.min(100, s + saturation - 80), l), position: 33 },
        { color: hslToHex((h + 180) % 360, Math.min(100, s + saturation - 80), l), position: 67 },
        { color: hslToHex((h + 270) % 360, Math.min(100, s + saturation - 80), l), position: 100 }
      ];
    
    case "rectangular":
      // Two complementary pairs
      return [
        { color: baseColor, position: 0 },
        { color: hslToHex((h + 60) % 360, Math.min(100, s + saturation - 80), l), position: 33 },
        { color: hslToHex((h + 180) % 360, Math.min(100, s + saturation - 80), l), position: 67 },
        { color: hslToHex((h + 240) % 360, Math.min(100, s + saturation - 80), l), position: 100 }
      ];
    
    default:
      // Default to shades
      return Array.from({ length: 5 }, (_, i) => {
        const position = (i * 100) / 4;
        const lightness = Math.max(10, Math.min(90, l - 30 + (i * 15)));
        return {
          color: hslToHex(h, Math.min(100, s + saturation - 80), lightness),
          position,
        };
      });
  }
};
