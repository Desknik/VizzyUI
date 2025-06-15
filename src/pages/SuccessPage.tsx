
import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/components/ui/sonner';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const { refetchProfile } = useProfile();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      toast.success('Pagamento processado com sucesso! Atualizando seu plano...');
      // Tenta buscar o perfil atualizado para refletir o novo plano
      refetchProfile();
    }
  }, [searchParams, refetchProfile]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
          <CardTitle className="text-2xl">Pagamento bem-sucedido!</CardTitle>
          <CardDescription>
            Obrigado por sua assinatura. Seu plano está sendo ativado. Em instantes, seus tokens e acesso serão atualizados.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link to="/pricing">Ver meus planos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
