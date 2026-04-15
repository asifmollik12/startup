import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Idea } from "@/lib/models/Idea";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await User.findById(params.id).select("-password").lean() as any;
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const ideas = await Idea.find({ userId: params.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ...user, id: user._id.toString(), ideas });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const { name, bio, avatar } = body;
  const user = await User.findByIdAndUpdate(params.id, { name, bio, avatar }, { new: true }).select("-password").lean() as any;
  return NextResponse.json({ ...user, id: user._id.toString() });
}
