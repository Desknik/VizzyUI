
import { useEffect, useState } from 'react';
import { useProfile } from './useProfile';

interface SubscriptionFeatures {
  canGenerateImages: boolean;
  hasPlaygroundAccess: boolean;
  hasApiAccess: boolean;
  monthlyTokens: number;
  maxGenerations: number;
}

export function useSubscription() {
  const { profile } = useProfile();
  const [features, setFeatures] = useState<SubscriptionFeatures>({
    canGenerateImages: false,
    hasPlaygroundAccess: false,
    hasApiAccess: false,
    monthlyTokens: 0,
    maxGenerations: 0,
  });

  useEffect(() => {
    if (!profile) return;

    const planFeatures = {
      free: {
        canGenerateImages: profile.tokens > 0,
        hasPlaygroundAccess: false,
        hasApiAccess: false,
        monthlyTokens: 10,
        maxGenerations: 10,
      },
      basic: {
        canGenerateImages: profile.tokens > 0,
        hasPlaygroundAccess: false,
        hasApiAccess: false,
        monthlyTokens: 50,
        maxGenerations: 50,
      },
      creator: {
        canGenerateImages: profile.tokens > 0,
        hasPlaygroundAccess: true,
        hasApiAccess: false,
        monthlyTokens: 150,
        maxGenerations: 150,
      },
      pro: {
        canGenerateImages: profile.tokens > 0,
        hasPlaygroundAccess: true,
        hasApiAccess: false,
        monthlyTokens: 500,
        maxGenerations: 500,
      },
      dev: {
        canGenerateImages: profile.tokens > 0,
        hasPlaygroundAccess: true,
        hasApiAccess: true,
        monthlyTokens: 1000,
        maxGenerations: 1000,
      },
    };

    const currentFeatures = planFeatures[profile.plan as keyof typeof planFeatures] || planFeatures.free;
    setFeatures(currentFeatures);
  }, [profile]);

  return {
    ...features,
    currentPlan: profile?.plan || 'free',
    tokens: profile?.tokens || 0,
    isSubscribed: profile?.plan !== 'free',
  };
}
