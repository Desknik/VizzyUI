
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-7xl font-bold text-designer-purple">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Oops! A página que você procura não foi encontrada.
        </p>
        <Link to="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Voltar para Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
