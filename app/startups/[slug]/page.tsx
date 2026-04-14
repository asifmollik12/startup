import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Startup } from "@/lib/models/Startup";
import { ArrowLeft, MapPin, Calendar, Users, TrendingUp, Globe, Building2 } from "lucide-react";

export const revalidate = 0;

async function getStartup(slug: string) {
  try {
    await connectDB();
    const s = await Startup.findOne({ slug }).lean() as any;
    if (!s) return null;
    return { ...s, id: s._id.toString() };
  } catch { return null; }
}

async function getRelated(industry: string, id: string) {
  try {
    await connectDB();
    const data = await Startup.find({ industry, _id: { $ne: id } }).limit(3).lean() as any[];
    return data.map((s: any) => ({ ...s, id: s._id.toString() }));
  } catch { return []; }
}

export default async function StartupPage({ params }: { params: { slug: string } }) {
  const startup = await getStartup(params.slug);
  if (!startup) notFound();
  const related = await getRelated(startup.industry, startup.id);

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Back bar */}
      <div className="bg-white border-b border-brand-border">
        <div className="container-wide py-3">
          <Link href="/startups" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors">
            <ArrowLeft size={14} /> All Startups
          </Link>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white border border-brand-border p-6">
              {/* Logo */}
              <div className="flex items-center gap-4 mb-5">
                {startup.logo ? (
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden border border-brand-border bg-gray-50">
                    <Image src={startup.logo} alt={startup.name} fill className="object-contain p-1" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-brand-red flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-serif font-bold text-2xl">{startup.name?.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h1 className="font-serif text-2xl font-bold text-brand-dark">{startup.name}</h1>
                  <p className="text-gray-500 text-sm">{startup.tagline}</p>
                </div>
              </div>

              {/* Stage badge */}
              {startup.stage && (
                <div className="mb-5">
                  <span className="badge-red text-[10px]">{startup.stage}</span>
                </div>
              )}

              {/* Details grid */}
              <div className="space-y-3">
                {[
                  { icon: Building2, label: "Industry", value: startup.industry },
                  { icon: Calendar, label: "Founded", value: startup.founded },
                  { icon: MapPin, label: "Location", value: startup.location },
                  { icon: TrendingUp, label: "Funding", value: startup.funding },
                ].filter(i => i.value).map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-brand-border last:border-0">
                    <Icon size={14} className="text-brand-red flex-shrink-0" />
                    <span className="text-xs text-gray-400 w-16 flex-shrink-0">{label}</span>
                    <span className="text-sm font-medium text-brand-dark">{value}</span>
                  </div>
                ))}
              </div>

              {/* Founders */}
              {startup.founders?.length > 0 && (
                <div className="mt-5 pt-5 border-t border-brand-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={13} className="text-brand-red" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Founders</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {startup.founders.map((f: string) => (
                      <span key={f} className="text-xs bg-brand-gray border border-brand-border px-3 py-1 text-gray-700">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Website */}
              {startup.website && startup.website !== "#" && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 border border-brand-border text-sm font-semibold text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors">
                  <Globe size={14} /> Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-brand-border p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-brand-red" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">About</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">{startup.name}</h2>
              <p className="text-gray-600 leading-relaxed text-base">{startup.description}</p>
            </div>

            {/* Funding highlight */}
            {startup.funding && (
              <div className="bg-brand-dark text-white p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Funding Raised</p>
                  <p className="font-serif text-3xl font-bold text-brand-gold">{startup.funding}</p>
                </div>
                <TrendingUp size={40} className="text-brand-gold/20" />
              </div>
            )}

            {/* Related startups */}
            {related.length > 0 && (
              <div className="bg-white border border-brand-border p-6">
                <h3 className="font-serif text-xl font-bold text-brand-dark mb-4">More in {startup.industry}</h3>
                <div className="space-y-3">
                  {related.map((s: any) => (
                    <Link key={s.id} href={`/startups/${s.slug}`}
                      className="flex items-center gap-4 p-3 border border-brand-border hover:border-brand-red transition-colors group">
                      {s.logo ? (
                        <div className="relative w-10 h-10 flex-shrink-0 border border-brand-border bg-gray-50">
                          <Image src={s.logo} alt={s.name} fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-brand-red flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{s.name?.charAt(0)}</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-brand-dark group-hover:text-brand-red transition-colors">{s.name}</p>
                        <p className="text-xs text-gray-400 truncate">{s.tagline}</p>
                      </div>
                      {s.stage && <span className="ml-auto text-[10px] badge-red flex-shrink-0">{s.stage}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
