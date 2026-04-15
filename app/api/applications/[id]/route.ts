import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose, { models, Schema } from "mongoose";
import { Startup } from "@/lib/models/Startup";
import { Founder } from "@/lib/models/Founder";
import nodemailer from "nodemailer";

const ApplicationSchema = new Schema({
  type: String, userId: String, userName: String, userEmail: String,
  status: { type: String, default: "pending" }, data: Schema.Types.Mixed,
}, { timestamps: true });
const Application = models.Application || mongoose.model("Application", ApplicationSchema);

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { status, emailSubject, emailBody } = await req.json();
  const app = await Application.findByIdAndUpdate(params.id, { status }, { new: true }).lean() as any;
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If approved, create the listing
  if (status === "approved") {
    if (app.type === "startup") {
      const d = app.data;
      const slug = d.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const exists = await Startup.findOne({ slug });
      if (!exists) {
        await Startup.create({
          name: d.name, slug, tagline: d.tagline, description: d.description,
          industry: d.industry, stage: d.stage, founded: d.founded,
          location: d.location, funding: d.funding, website: d.website,
          founders: d.founders ? d.founders.split(",").map((f: string) => f.trim()) : [],
          logo: "", coverImage: "",
        });
      }
    } else if (app.type === "founder") {
      const d = app.data;
      const slug = d.fullName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const exists = await Founder.findOne({ slug });
      if (!exists) {
        await Founder.create({
          name: d.fullName, slug, title: d.title, company: d.company,
          industry: d.industry, founded: d.founded, location: d.location,
          bio: d.bio, netWorth: d.netWorth || "Not public",
          avatar: "", coverImage: "", achievements: [], socialLinks: {},
        });
      }
    }
  }

  // Send email
  if (app.userEmail && emailSubject && emailBody) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: `"Start-Up News" <${process.env.EMAIL_USER}>`,
        to: app.userEmail,
        subject: emailSubject,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#C8102E;padding:20px;text-align:center;">
              <span style="color:#fff;font-size:20px;font-weight:bold;">Start-Up News</span>
            </div>
            <div style="padding:32px;background:#f9f9f9;">
              <div style="background:#fff;padding:28px;border:1px solid #e5e5e5;">
                ${emailBody.replace(/\n/g, "<br/>")}
              </div>
            </div>
            <div style="padding:12px;text-align:center;background:#f0f0f0;">
              <p style="color:#aaa;font-size:11px;margin:0;">© 2026 Start-Up News · Bangladesh's Premier Business Magazine</p>
            </div>
          </div>
        `,
      });
    } catch (e) { console.error("Email error:", e); }
  }

  return NextResponse.json(app);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await Application.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
