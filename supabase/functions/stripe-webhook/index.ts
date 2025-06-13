
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

const getPlanConfig = (productId: string) => {
  const plans = {
    'prod_SUOELVXJfgUken': { // Plano Básico
      name: 'basic',
      tokens: 50,
      api_access: false,
      playground_access: false
    },
    'prod_SUOHmpnkEbumcP': { // Plano Criador+
      name: 'creator',
      tokens: 150,
      api_access: false,
      playground_access: true
    },
    'prod_SUOILPsIzrDLPQ': { // Plano Pro Max
      name: 'pro',
      tokens: 500,
      api_access: false,
      playground_access: true
    },
    'prod_SUOKRrqXfcNJ5M': { // Plano Dev API
      name: 'dev',
      tokens: 1000,
      api_access: true,
      playground_access: true
    }
  };
  
  return plans[productId] || null;
};

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Webhook received");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No signature provided");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    logStep("Event type", { type: event.type });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        
        if (!userId) {
          logStep("No user_id in metadata");
          break;
        }

        // Recuperar detalhes da subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const productId = subscription.items.data[0].price.product as string;
        const planConfig = getPlanConfig(productId);

        if (!planConfig) {
          logStep("Unknown product ID", { productId });
          break;
        }

        logStep("Updating user plan", { userId, plan: planConfig.name });

        await supabaseClient.rpc('update_user_plan', {
          user_id: userId,
          new_plan: planConfig.name,
          new_tokens: planConfig.tokens,
          api_access_enabled: planConfig.api_access,
          playground_access_enabled: planConfig.playground_access,
          customer_id: session.customer as string,
          subscription_id: session.subscription as string,
          sub_status: subscription.status,
          sub_end: new Date(subscription.current_period_end * 1000).toISOString()
        });

        logStep("User plan updated successfully");
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Encontrar usuário pela subscription_id
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (!profile) {
          logStep("Profile not found for subscription", { subscriptionId: subscription.id });
          break;
        }

        if (subscription.status === 'canceled' || event.type === 'customer.subscription.deleted') {
          // Reverter para plano gratuito
          logStep("Reverting to free plan", { userId: profile.id });
          
          await supabaseClient.rpc('update_user_plan', {
            user_id: profile.id,
            new_plan: 'free',
            new_tokens: 10,
            api_access_enabled: false,
            playground_access_enabled: false,
            customer_id: subscription.customer as string,
            subscription_id: null,
            sub_status: 'canceled',
            sub_end: null
          });
        } else {
          // Atualizar status da subscription
          const productId = subscription.items.data[0].price.product as string;
          const planConfig = getPlanConfig(productId);

          if (planConfig) {
            await supabaseClient.rpc('update_user_plan', {
              user_id: profile.id,
              new_plan: planConfig.name,
              new_tokens: planConfig.tokens,
              api_access_enabled: planConfig.api_access,
              playground_access_enabled: planConfig.playground_access,
              customer_id: subscription.customer as string,
              subscription_id: subscription.id,
              sub_status: subscription.status,
              sub_end: new Date(subscription.current_period_end * 1000).toISOString()
            });
          }
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
