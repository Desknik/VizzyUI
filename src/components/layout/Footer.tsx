
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-designer-purple" />
          <span className="text-sm font-medium">BackgroundAI</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BackgroundAI. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
