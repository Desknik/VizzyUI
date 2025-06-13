
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface UpgradePromptProps {
  title?: string;
  description?: string;
  feature?: string;
}

export default function UpgradePrompt({ 
  title = "Tokens insuficientes", 
  description = "Você precisa de mais tokens para continuar gerando imagens.",
  feature
}: UpgradePromptProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Crown className="h-8 w-8 text-yellow-500" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
          {feature && (
            <span className="block mt-2 font-medium">
              Funcionalidade: {feature}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        <Button asChild className="w-full">
          <Link to="/pricing">
            <Zap className="mr-2 h-4 w-4" />
            Ver Planos
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          Escolha o plano ideal para suas necessidades
        </p>
      </CardContent>
    </Card>
  );
}
