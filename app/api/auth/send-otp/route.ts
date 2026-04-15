import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

// In-memory OTP store (works for serverless — expires in 10 min)
const otpStore = new Map<string, { otp: string; expires: number }>();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await connectDB();
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const otp = generateOTP();
    otpStore.set(email.toLowerCase(), { otp, expires: Date.now() + 10 * 60 * 1000 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Start-Up News" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${otp} is your Start-Up News verification code`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
          <div style="background:#C8102E;padding:24px;text-align:center;">
            <span style="color:#fff;font-size:22px;font-weight:bold;letter-spacing:1px;">Start-Up News</span>
          </div>
          <div style="padding:40px 32px;background:#f9f9f9;">
            <div style="background:#fff;padding:32px;border:1px solid #e5e5e5;">
              <h2 style="font-size:22px;font-weight:bold;margin:0 0 12px;">Enter the code below to verify your email.</h2>
              <p style="color:#555;margin:0 0 24px;">Use this code to complete your registration on Start-Up News.</p>
              <div style="background:#C8102E;color:#fff;font-size:28px;font-weight:bold;letter-spacing:6px;padding:16px 24px;display:inline-block;margin-bottom:24px;">${otp}</div>
              <p style="color:#888;font-size:13px;margin:0;">This code is active for 10 minutes.</p>
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />
              <p style="color:#888;font-size:12px;margin:0;"><strong>Why did I get this email?</strong><br/>We sent this email because somebody requested it. If this wasn't you, you can ignore it.</p>
            </div>
          </div>
          <div style="padding:16px;text-align:center;background:#f0f0f0;">
            <p style="color:#aaa;font-size:11px;margin:0;">© 2026 Start-Up News · Bangladesh's Premier Business Magazine</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Verify OTP
  const { email, otp } = await req.json();
  const record = otpStore.get(email.toLowerCase());
  if (!record) return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 });
  if (Date.now() > record.expires) { otpStore.delete(email.toLowerCase()); return NextResponse.json({ error: "OTP expired" }, { status: 400 }); }
  if (record.otp !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  otpStore.delete(email.toLowerCase());
  return NextResponse.json({ success: true });
}
