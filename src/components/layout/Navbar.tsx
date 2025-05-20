
import { Button } from "@/components/ui/button";
import { Sparkles, Palette, Image, Moon, Sun, History, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const { user, signOut } = useAuth();

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
          <Link to="/styles">
            <Button variant="ghost" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Estilos</span>
            </Button>
          </Link>
          <Link to="/gradients">
            <Button variant="ghost" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Gradientes</span>
            </Button>
          </Link>
          <Link to="/ai-backgrounds">
            <Button variant="ghost" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>AI Backgrounds</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link to="/history">
                  <DropdownMenuItem>
                    <History className="mr-2 h-4 w-4" />
                    <span>Histórico</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
