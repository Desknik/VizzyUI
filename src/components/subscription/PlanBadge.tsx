
import { Badge } from "@/components/ui/badge";
import { Crown, Code, Rocket, Zap } from "lucide-react";

interface PlanBadgeProps {
  plan: string;
  className?: string;
}

export default function PlanBadge({ plan, className }: PlanBadgeProps) {
  const planConfig = {
    free: { label: 'Gratuito', icon: Zap, variant: 'secondary' as const },
    basic: { label: 'Básico', icon: Zap, variant: 'default' as const },
    creator: { label: 'Criador+', icon: Crown, variant: 'default' as const },
    pro: { label: 'Pro Max', icon: Rocket, variant: 'default' as const },
    dev: { label: 'Dev API', icon: Code, variant: 'default' as const },
  };

  const config = planConfig[plan as keyof typeof planConfig] || planConfig.free;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
