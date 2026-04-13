import { connectDB } from "@/lib/mongodb";
import { Founder as FounderModel } from "@/lib/models/Founder";
import FoundersClient from "./FoundersClient";

export const revalidate = 60;

async function getFounders() {
  try {
    await connectDB();
    const data = await FounderModel.find().sort({ rank: 1 }).lean();
    return data.map((f: any) => ({ ...f, id: f._id.toString(), _id: undefined }));
  } catch { return []; }
}

export default async function FoundersPage() {
  const founders = await getFounders();
  return <FoundersClient founders={founders} />;
}
