import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subscriber } from "@/lib/models/Subscriber";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { subject, body } = await req.json();
    if (!subject || !body) return NextResponse.json({ error: "Subject and body required" }, { status: 400 });

    await connectDB();
    const subs = await Subscriber.find().lean() as any[];
    if (subs.length === 0) return NextResponse.json({ error: "No subscribers" }, { status: 400 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Send in batches of 50 (Gmail limit)
    const emails = subs.map((s: any) => s.email);
    const batchSize = 50;
    let sent = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      await transporter.sendMail({
        from: `"Start-Up News" <${process.env.EMAIL_USER}>`,
        bcc: batch.join(","),
        subject,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
            <div style="background:#0A0A0A;padding:24px;text-align:center;">
              <span style="color:#fff;font-size:20px;font-weight:bold;letter-spacing:1px;">Start-Up News</span>
            </div>
            <div style="padding:32px;background:#f9f9f9;">
              <div style="background:#fff;padding:32px;border:1px solid #e5e5e5;">
                ${body}
              </div>
            </div>
            <div style="padding:16px;text-align:center;background:#f0f0f0;">
              <p style="color:#aaa;font-size:11px;margin:0;">© 2026 Start-Up News · Bangladesh's Premier Business Magazine</p>
              <p style="color:#aaa;font-size:11px;margin:4px 0 0;">You're receiving this because you subscribed at start-upnews.com</p>
            </div>
          </div>
        `,
      });
      sent += batch.length;
    }

    return NextResponse.json({ success: true, sent });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
