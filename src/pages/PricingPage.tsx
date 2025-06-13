
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket, Code } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

const plans = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para começar a criar',
    icon: Zap,
    features: [
      '10 tokens mensais',
      'Modelos básicos',
      'Histórico limitado',
      'Suporte da comunidade'
    ],
    tokens: 10,
    priceId: null,
    popular: false
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 'R$ 19',
    period: '/mês',
    description: 'Para iniciantes e uso casual',
    icon: Zap,
    features: [
      '50 tokens mensais',
      'Modelo Flux Schnell',
      'Histórico completo',
      'Suporte por email'
    ],
    tokens: 50,
    priceId: 'price_1QOXvTH6zBwEQzgr8KlAZfSF', // Substitua pelo price_id real
    popular: false
  },
  {
    id: 'creator',
    name: 'Criador+',
    price: 'R$ 39',
    period: '/mês',
    description: 'Para usuários criativos',
    icon: Crown,
    features: [
      '150 tokens mensais',
      'Modelos avançados',
      'Acesso ao playground',
      'Histórico ilimitado',
      'Suporte prioritário'
    ],
    tokens: 150,
    priceId: 'price_1QOXwOH6zBwEQzgrcVJKqMmB', // Substitua pelo price_id real
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro Max',
    price: 'R$ 79',
    period: '/mês',
    description: 'Para usuários avançados',
    icon: Rocket,
    features: [
      '500 tokens mensais',
      'Melhores modelos',
      'Playground completo',
      'Gerações em lote',
      'Suporte dedicado'
    ],
    tokens: 500,
    priceId: 'price_1QOXwvH6zBwEQzgrbMNc2w7r', // Substitua pelo price_id real
    popular: false
  },
  {
    id: 'dev',
    name: 'Dev API',
    price: 'R$ 149',
    period: '/mês',
    description: 'Para desenvolvedores',
    icon: Code,
    features: [
      '1000 tokens mensais',
      'Acesso completo à API',
      'Modelos mais modernos',
      'Playground liberado',
      'Suporte técnico 24/7'
    ],
    tokens: 1000,
    priceId: 'price_1QOXxRH6zBwEQzgr5QKmN8pL', // Substitua pelo price_id real
    popular: false
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const { profile } = useProfile();

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) {
      toast.error("Faça login para assinar um plano");
      return;
    }

    if (!plan.priceId) {
      toast.info("Este é o plano gratuito atual");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: plan.priceId,
          planName: plan.id
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast.error('Erro ao criar sessão de pagamento');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast.error('Erro ao abrir portal do cliente');
    }
  };

  const getCurrentPlan = () => {
    return plans.find(p => p.id === (profile?.plan || 'free'));
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Escolha seu plano</h1>
        <p className="text-xl text-muted-foreground mb-2">
          Gere imagens incríveis com IA de forma simples e rápida
        </p>
        {profile && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-sm">
              Plano atual: {currentPlan?.name}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {profile.tokens} tokens disponíveis
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = profile?.plan === plan.id;
          const canUpgrade = profile && plan.id !== 'free' && profile.plan !== plan.id;

          return (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Mais Popular
                </Badge>
              )}
              {isCurrentPlan && (
                <Badge variant="secondary" className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  Seu Plano
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {user ? (
                  isCurrentPlan ? (
                    plan.id === 'free' ? (
                      <Button variant="outline" className="w-full" disabled>
                        Plano Atual
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleManageSubscription}
                      >
                        Gerenciar Assinatura
                      </Button>
                    )
                  ) : (
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan)}
                      disabled={!canUpgrade && plan.id !== 'free'}
                    >
                      {plan.id === 'free' ? 'Plano Atual' : 'Assinar'}
                    </Button>
                  )
                ) : (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/auth">Fazer Login</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Todos os planos incluem geração ilimitada de gradientes e acesso à galeria da comunidade.
        </p>
        {profile?.plan !== 'free' && (
          <Button variant="ghost" onClick={handleManageSubscription}>
            Gerenciar minha assinatura
          </Button>
        )}
      </div>
    </div>
  );
}
