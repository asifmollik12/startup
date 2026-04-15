import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    const user = await User.findOne({ email }).lean() as any;
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    return NextResponse.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
