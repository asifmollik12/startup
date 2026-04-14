import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";

const industries = [
  { name: "B2B Commerce", slug: "b2b-commerce", color: "#8B5CF6", description: "B2B commerce and fintech platforms" },
  { name: "EdTech", slug: "edtech", color: "#3B82F6", description: "Education technology and e-learning" },
  { name: "Mobility", slug: "mobility", color: "#F59E0B", description: "Ride-sharing, logistics and urban mobility" },
  { name: "E-commerce", slug: "e-commerce", color: "#10B981", description: "Online retail and grocery delivery" },
  { name: "HR Tech", slug: "hr-tech", color: "#6366F1", description: "Human resources and job platforms" },
  { name: "Telecom", slug: "telecom", color: "#0EA5E9", description: "Telecommunications and social business" },
  { name: "Fintech", slug: "fintech", color: "#C8102E", description: "Financial technology and mobile banking" },
  { name: "Agritech", slug: "agritech", color: "#22C55E", description: "Agricultural technology and supply chain" },
  { name: "Logistics", slug: "logistics", color: "#F97316", description: "Freight and last-mile delivery" },
  { name: "Mobility Tech", slug: "mobility-tech", color: "#EAB308", description: "Technology-driven urban transportation" },
  { name: "AI / Marketing Tech", slug: "ai-marketing-tech", color: "#A855F7", description: "AI-powered marketing automation" },
  { name: "Healthcare Tech", slug: "healthcare-tech", color: "#EC4899", description: "Digital health and medicine delivery" },
  { name: "Beauty / E-commerce", slug: "beauty-ecommerce", color: "#F43F5E", description: "Beauty and personal care e-commerce" },
];

export async function GET() {
  try {
    await connectDB();
    await Category.deleteMany({});
    await Category.insertMany(industries);
    return NextResponse.json({ success: true, count: industries.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
