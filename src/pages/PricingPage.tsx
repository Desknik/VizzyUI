
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket, Code } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const plansData = [
  {
    id: 'basic',
    name: 'Básico',
    description: 'Para iniciantes e uso casual',
    icon: Zap,
    features: [
      '50 tokens mensais',
      'Modelo Flux Schnell',
      'Histórico completo',
      'Suporte por email'
    ],
    pricing: {
      monthly: { price: 'R$ 5', period: '/mês', priceId: 'price_1RZPS82VMMxDsKo6TdVbmUwt', tokens: 50 },
      annually: { price: 'R$ 50', period: '/ano', priceId: 'price_1RZPS82VMMxDsKo6H8Aa3Ymo', tokens: 50 }
    },
    popular: false
  },
  {
    id: 'creator',
    name: 'Criador+',
    description: 'Para usuários criativos',
    icon: Crown,
    features: [
      '150 tokens mensais',
      'Modelos avançados',
      'Acesso ao playground',
      'Histórico ilimitado',
      'Suporte prioritário'
    ],
    pricing: {
      monthly: { price: 'R$ 15', period: '/mês', priceId: 'price_1RZPUU2VMMxDsKo6mwMbwKaQ', tokens: 150 },
      annually: { price: 'R$ 150', period: '/ano', priceId: 'price_1RZPUU2VMMxDsKo6gfUuPQnz', tokens: 150 }
    },
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro Max',
    description: 'Para usuários avançados',
    icon: Rocket,
    features: [
      '500 tokens mensais',
      'Melhores modelos',
      'Playground completo',
      'Gerações em lote',
      'Suporte dedicado'
    ],
    pricing: {
      monthly: { price: 'R$ 35', period: '/mês', priceId: 'price_1RZPW02VMMxDsKo6NpG5ky1H', tokens: 500 },
      annually: { price: 'R$ 350', period: '/ano', priceId: 'price_1RZPW02VMMxDsKo6nTDpZNC4', tokens: 500 }
    },
    popular: false
  },
  {
    id: 'dev',
    name: 'Dev API',
    description: 'Para desenvolvedores',
    icon: Code,
    features: [
      '1000 tokens mensais',
      'Acesso completo à API',
      'Modelos mais modernos',
      'Playground liberado',
      'Suporte técnico 24/7'
    ],
    pricing: {
      monthly: { price: 'R$ 89', period: '/mês', priceId: 'price_1RZPYI2VMMxDsKo6bJrsGt7g', tokens: 1000 },
      annually: { price: 'R$ 890', period: '/ano', priceId: 'price_1RZPYI2VMMxDsKo6YxyouuFB', tokens: 1000 }
    },
    popular: false
  }
];

const freePlanInfo = {
  id: 'free',
  name: 'Gratuito',
  description: '10 tokens mensais com modelos limitados.'
};

export default function PricingPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const mainPlans = plansData.filter(p => p.id !== 'dev');
  const devPlan = plansData.find(p => p.id === 'dev');

  const handleSubscribe = async (planDetails: { priceId: string; planName: string }) => {
    if (!user) {
      toast.error("Faça login para assinar um plano");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: planDetails.priceId,
          planName: planDetails.planName
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

  const getCurrentPlanName = () => {
    if (!profile) return '';
    if (profile.plan === 'free') return freePlanInfo.name;
    const currentPlanData = plansData.find(p => p.id === profile.plan);
    return currentPlanData?.name || 'Gratuito';
  };
  
  const renderPlanCard = (plan: typeof plansData[0]) => {
    const Icon = plan.icon;
    const isCurrentPlan = profile?.plan === plan.id;
    const currentPriceInfo = plan.pricing[billingCycle];

    return (
      <Card key={plan.id} className={`relative flex flex-col justify-center items-center ${plan.popular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
        {plan.popular && (
          <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            Mais Popular
          </Badge>
        )}
        {isCurrentPlan && (
          <Badge variant="secondary" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            Seu Plano
          </Badge>
        )}
        
        <CardHeader className="text-center pb-4">
          <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold">{currentPriceInfo.price}</span>
            <span className="text-muted-foreground">{currentPriceInfo.period}</span>
          </div>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>

        <CardContent className="w-full max-w-lg pt-0 flex flex-col flex-grow">
          <ul className="space-y-2 mb-6 flex-grow">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {user ? (
            isCurrentPlan ? (
              <Button 
                variant="outline" 
                className="w-full mt-auto"
                onClick={handleManageSubscription}
              >
                Gerenciar Assinatura
              </Button>
            ) : (
              <Button 
                className="w-full mt-auto" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe({ planName: plan.id, priceId: currentPriceInfo.priceId})}
              >
                Assinar
              </Button>
            )
          ) : (
            <Button variant="outline" className="w-full mt-auto" asChild>
              <Link to="/auth">Fazer Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Escolha seu plano</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Gere imagens incríveis com IA de forma simples e rápida
        </p>

        <div className="flex justify-center">
            <Tabs defaultValue="monthly" onValueChange={(value) => setBillingCycle(value as 'monthly' | 'annually')} className="mb-6">
                <TabsList>
                    <TabsTrigger value="monthly">Mensal</TabsTrigger>
                    <TabsTrigger value="annually">
                        Anual
                        <Badge variant="outline" className="ml-2 text-green-700 border-green-200 bg-green-50">2 meses grátis</Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        {profile && (
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-sm">
              Plano atual: {getCurrentPlanName()}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {profile.tokens} tokens disponíveis
            </Badge>
          </div>
        )}
      </div>
      
      {profile?.plan === 'free' && (
        <Card className="mb-8 border-primary bg-primary-foreground">
          <CardHeader>
            <CardTitle>Você está no plano Gratuito</CardTitle>
            <CardDescription>{freePlanInfo.description} Faça um upgrade para liberar todo o potencial da nossa IA.</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mainPlans.map(plan => renderPlanCard(plan))}
      </div>
      
      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
            <span className="bg-background px-4 text-sm text-muted-foreground font-semibold">Exclusivo para Desenvolvedores</span>
        </div>
      </div>
      
      {devPlan && (
        <div className="flex justify-center">
          <div className="w-full">
            {renderPlanCard(devPlan)}
          </div>
        </div>
      )}

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Todos os planos incluem geração ilimitada de gradientes e acesso à galeria da comunidade.
        </p>
        {profile?.plan && profile.plan !== 'free' && (
          <Button variant="ghost" onClick={handleManageSubscription}>
            Gerenciar minha assinatura
          </Button>
        )}
      </div>
    </div>
  );
}
