import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const invoice_id = searchParams.get("invoice_id");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://start-upnews.com";

  if (!invoice_id) return NextResponse.redirect(`${baseUrl}/subscribe?status=failed`);

  try {
    // Verify payment with Paymently
    const res = await fetch(`${process.env.UDDOKTA_BASE_URL}/api/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "RT-UDDOKTAPAY-API-KEY": process.env.UDDOKTA_API_KEY!,
      },
      body: JSON.stringify({ invoice_id }),
    });

    const data = await res.json();

    if (data.status !== "COMPLETED") {
      return NextResponse.redirect(`${baseUrl}/subscribe?status=failed`);
    }

    const { user_id, plan } = data.metadata || {};
    if (!user_id) return NextResponse.redirect(`${baseUrl}/subscribe?status=failed`);

    await connectDB();

    // Set subscription expiry to 30 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    await User.findByIdAndUpdate(user_id, {
      subscription: plan || "pro",
      subscriptionExpiry: expiry,
    });

    return NextResponse.redirect(`${baseUrl}/subscribe?status=success&plan=${plan}`);
  } catch (e: any) {
    return NextResponse.redirect(`${baseUrl}/subscribe?status=failed`);
  }
}
