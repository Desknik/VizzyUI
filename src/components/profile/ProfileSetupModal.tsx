
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface ProfileSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileSetupModal({ open, onOpenChange }: ProfileSetupModalProps) {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const success = await updateProfile({
      name: name.trim(),
      avatar_url: avatarUrl.trim() || null,
    });

    if (success) {
      onOpenChange(false);
    }
    setIsLoading(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete seu perfil</DialogTitle>
          <DialogDescription>
            Adicione suas informações para personalizar sua experiência. Você recebeu {profile?.tokens || 10} tokens gratuitos para gerar imagens!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="text-lg">
                  {name ? getInitials(name) : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={() => {
                  const url = prompt('Cole a URL da imagem do avatar:');
                  if (url) setAvatarUrl(url);
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">URL do Avatar (opcional)</Label>
            <Input
              id="avatar"
              type="url"
              placeholder="https://exemplo.com/avatar.jpg"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">
              {profile?.tokens || 10} tokens disponíveis
            </div>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? 'Salvando...' : 'Salvar perfil'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
