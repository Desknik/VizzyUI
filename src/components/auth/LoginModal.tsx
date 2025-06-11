
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { signIn, signUp } = useAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
      onOpenChange(false);
      // Limpar campos após login bem-sucedido
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      // Error is already handled in useAuth
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(registerEmail, registerPassword);
      onOpenChange(false);
      // Limpar campos após cadastro bem-sucedido
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
    } catch (error) {
      // Error is already handled in useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Faça login para continuar</DialogTitle>
          <DialogDescription>
            Você precisa estar logado para criar backgrounds personalizados.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-email">Email</Label>
                <Input 
                  id="modal-email" 
                  type="email" 
                  placeholder="seu-email@exemplo.com" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-password">Senha</Label>
                <Input 
                  id="modal-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-register-email">Email</Label>
                <Input 
                  id="modal-register-email" 
                  type="email" 
                  placeholder="seu-email@exemplo.com" 
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-register-password">Senha</Label>
                <Input 
                  id="modal-register-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-confirm-password">Confirmar senha</Label>
                <Input 
                  id="modal-confirm-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
