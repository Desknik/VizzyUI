
import { Button } from "@/components/ui/button";
import { Sparkles, Palette, Image, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-designer-purple" />
          <Link to="/" className="text-xl font-bold">
            BackgroundAI
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/gradients">
            <Button variant="ghost" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Gradientes</span>
            </Button>
          </Link>
          <Link to="/ai-backgrounds">
            <Button variant="ghost" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>AI Backgrounds</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
