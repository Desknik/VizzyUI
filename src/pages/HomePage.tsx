import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Palette, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import StyleCarousel from "@/components/styles/StyleCarousel";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-designer-purple/20 via-transparent to-designer-teal/20" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 animate-float text-5xl font-bold tracking-tight sm:text-6xl">
              Backgrounds Impressionantes para Seus Designs
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Crie gradientes e backgrounds únicos com inteligência artificial
              para levar seus projetos a outro nível.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/gradients">
                <Button size="lg" className="gap-2">
                  <Palette className="h-5 w-5" />
                  Criar Gradientes
                </Button>
              </Link>
              <Link to="/styles">
                <Button size="lg" variant="outline" className="gap-2">
                  <Image className="h-5 w-5" />
                  Backgrounds com IA
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decoration elements */}
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-designer-purple/10 blur-3xl" />
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-designer-teal/10 blur-3xl" />
      </section>

      <section className="py-10">
        <div className="container">
          <h2 className="mb-6 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Estilos de Background
          </h2>
          <p className="text-center mb-8 text-muted-foreground max-w-2xl mx-auto">
            Explore nossa coleção de estilos de imagens para gerar fundos impressionantes para seus projetos.
          </p>
          <StyleCarousel autoScroll />
          <div className="mt-8 text-center">
            <Link to="/styles">
              <Button variant="outline" size="lg">
                Ver todos os estilos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            O que você pode criar
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-designer-purple via-designer-pink to-designer-teal"></div>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-designer-purple" />
                  <h3 className="text-xl font-semibold">Gradientes CSS</h3>
                </div>
                <p className="text-muted-foreground">
                  Crie gradientes impressionantes para seus projetos web. Personalize cores, 
                  ângulos e posições, então exporte para CSS ou Tailwind.
                </p>
                <Link to="/gradients">
                  <Button className="mt-4">Criar Gradientes</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div 
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80)"
                }}
              ></div>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-designer-teal" />
                  <h3 className="text-xl font-semibold">Backgrounds com IA</h3>
                </div>
                <p className="text-muted-foreground">
                  Utilize inteligência artificial para gerar backgrounds únicos baseados em estilos 
                  predefinidos ou em imagens de referência.
                </p>
                <Link to="/styles">
                  <Button className="mt-4" variant="secondary">Criar com IA</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Escolha uma ferramenta e crie backgrounds incríveis para seus projetos em minutos
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/gradients">
                <Button size="lg" variant="default" className="gap-2">
                  <Palette className="h-5 w-5" />
                  Criar Gradientes
                </Button>
              </Link>
              <Link to="/styles">
                <Button size="lg" variant="outline" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Backgrounds com IA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
