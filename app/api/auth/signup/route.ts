import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    return NextResponse.json({ id: user._id, name: user.name, email: user.email }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
