import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Founder as FounderModel } from "@/lib/models/Founder";

const founders = [
  {
    name: "Afeef Zaman",
    slug: "afeef-zaman",
    title: "Founder & CEO",
    company: "ShopUp",
    industry: "B2B Commerce",
    avatar: "",
    coverImage: "",
    bio: "Afeef Zaman is the Founder & CEO of ShopUp, a B2B commerce and fintech platform empowering small retailers across Bangladesh.",
    netWorth: "Not public",
    founded: "2016",
    location: "Dhaka",
    achievements: [],
    socialLinks: {},
    rank: 1,
  },
  {
    name: "Ayman Sadiq",
    slug: "ayman-sadiq",
    title: "Founder & CEO",
    company: "10 Minute School",
    industry: "EdTech",
    avatar: "",
    coverImage: "",
    bio: "Ayman Sadiq founded 10 Minute School, Bangladesh's largest online education platform, making quality learning accessible to millions.",
    netWorth: "Not public",
    founded: "2015",
    location: "Dhaka",
    achievements: [],
    socialLinks: {},
    rank: 2,
  },
  {
    name: "Hussain M Elius",
    slug: "hussain-m-elius",
    title: "Co-founder",
    company: "Pathao",
    industry: "Mobility",
    avatar: "",
    coverImage: "",
    bio: "Hussain M Elius co-founded Pathao, Bangladesh's leading ride-sharing and logistics super app.",
    netWorth: "Not public",
    founded: "2015",
    location: "Dhaka",
    achievements: [],
    socialLinks: {},
    rank: 3,
  },
  {
    name: "Waseem Alim",
    slug: "waseem-alim",
    title: "Co-founder & CEO",
    company: "Chaldal",
    industry: "E-commerce",
    avatar: "",
    coverImage: "",
    bio: "Waseem Alim co-founded Chaldal, Bangladesh's first and largest online grocery delivery platform.",
    netWorth: "Not public",
    founded: "2013",
    location: "Dhaka",
    achievements: [],
    socialLinks: {},
    rank: 4,
  },
  {
    name: "Fahim Mashroor",
    slug: "fahim-mashroor",
    title: "Founder",
    company: "Bdjobs, Ajkerdeal",
    industry: "HR Tech",
    avatar: "",
    coverImage: "",
    bio: "Fahim Mashroor founded Bdjobs and Ajkerdeal, pioneering online job listings and e-commerce in Bangladesh.",
    netWorth: "$35M+",
    founded: "2000",
    location: "Dhaka",
    achievements: [],
    socialLinks: {},
    rank: 5,
  },
  {
    name: "Iqbal Quadir",
    slug: "iqbal-quadir",
    title: "Founder",
    company: "GrameenPhone",
    industry: "Telecom",
    avatar: "",
    coverImage: "",
    bio: "Iqbal Quadir founded GrameenPhone, transforming telecommunications and social business in Bangladesh.",
    netWorth: "Not public",
    founded: "1997",
    location: "Dhaka",
    achievements: [],
    socialLinks: {},
    rank: 6,
  },
];

export async function GET() {
  try {
    await connectDB();
    await FounderModel.deleteMany({});
    await FounderModel.insertMany(founders);
    return NextResponse.json({ success: true, count: founders.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
