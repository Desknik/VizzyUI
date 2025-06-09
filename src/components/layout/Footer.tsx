
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 bg-card/80 backdrop-blur-sm relative z-20">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">BackgroundAI</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BackgroundAI. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
