import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const body = await request.text();

  console.log("[Stripe Webhook] Received event - PLACEHOLDER");
  console.log("[Stripe Webhook] Body length:", body.length);

  return NextResponse.json({ 
    received: true,
    message: "Stripe webhook placeholder - not yet configured" 
  });
}

export async function GET() {
  return NextResponse.json({
    status: "Stripe webhook endpoint ready",
    configured: false,
    message: "This endpoint is a placeholder for future Stripe integration. Configure STRIPE_WEBHOOK_SECRET to enable.",
  });
}
