import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId, plan } = await req.json();
    if (!userId || !plan) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();
    const user = await User.findById(userId).lean() as any;
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const amount = plan === "pro" ? "499" : "0";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://start-upnews.com";

    const res = await fetch(`${process.env.UDDOKTA_BASE_URL}/api/checkout-v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTA_API_KEY!,
      },
      body: JSON.stringify({
        full_name: user.name,
        email: user.email,
        amount,
        metadata: { user_id: userId, plan },
        redirect_url: `${baseUrl}/api/payment/callback`,
        cancel_url: `${baseUrl}/subscribe?status=cancelled`,
        return_type: "GET",
      }),
    });

    const data = await res.json();
    if (!data.status) return NextResponse.json({ error: data.message || "Payment init failed" }, { status: 500 });

    return NextResponse.json({ payment_url: data.payment_url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
