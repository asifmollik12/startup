import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Founder as FounderModel } from "@/lib/models/Founder";

export const revalidate = 0;

async function getFounders() {
  try {
    await connectDB();
    const data = await FounderModel.find().sort({ rank: 1 }).lean();
    return data.map((f: any) => ({ ...f, id: f._id.toString() }));
  } catch { return []; }
}

export default async function FoundersPage() {
  const founders = await getFounders();
  const industries = ["All", ...Array.from(new Set(founders.map((f: any) => f.industry).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-brand-border bg-white">
        <div className="container-wide py-4">
          <span className="section-label">Profiles</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-dark mt-2 mb-2">Founder Profiles</h1>
          <p className="text-gray-500 max-w-xl text-sm">Meet the visionaries building Bangladesh's future — one startup at a time.</p>
        </div>
      </div>

      {/* Category bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-brand-border shadow-sm">
        <div className="container-wide">
          <div className="flex items-center gap-0 overflow-x-auto">
            {industries.map(ind => (
              <span key={ind} className={`flex-shrink-0 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap ${
                ind === "All" ? "border-brand-red text-brand-red" : "border-transparent text-gray-500"
              }`}>{ind}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide py-6">
        {founders.length === 0 ? (
          <p className="text-gray-400 text-center py-16">No founders yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {founders.map((founder: any) => (
              <Link key={founder.id} href={`/founders/${founder.slug}`}
                className="group bg-white border border-brand-border card-hover block overflow-hidden">
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {(founder.coverImage || founder.avatar) ? (
                    <Image src={founder.coverImage || founder.avatar} alt={founder.name} fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="font-serif font-bold text-3xl text-gray-400">{founder.name?.charAt(0)}</span>
                    </div>
                  )}
                  {founder.rank && (
                    <div className="absolute top-0 left-0 bg-brand-red px-2 py-1">
                      <span className="text-white font-bold text-[10px]">#{founder.rank}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span className="section-label text-[8px]">{founder.industry}</span>
                  <h3 className="font-serif font-bold text-sm text-brand-dark mt-0.5 mb-0.5 leading-snug group-hover:text-brand-red transition-colors line-clamp-1">{founder.name}</h3>
                  <p className="text-gray-500 text-[11px] line-clamp-1">{founder.title} · {founder.company}</p>
                  {founder.netWorth && (
                    <p className="text-brand-gold font-bold text-xs mt-1">{founder.netWorth}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
