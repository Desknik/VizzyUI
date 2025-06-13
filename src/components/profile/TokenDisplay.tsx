
import { Coins } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

export default function TokenDisplay() {
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
      <Coins className="h-4 w-4 text-yellow-600" />
      <span className="font-medium">{profile.tokens}</span>
      <span className="text-muted-foreground">tokens</span>
    </div>
  );
}
