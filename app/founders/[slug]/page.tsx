import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, Calendar, ArrowLeft, Twitter, Linkedin, Globe, CheckCircle, TrendingUp, Award, ArrowRight, Users } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Founder as FounderModel } from "@/lib/models/Founder";
import { Article as ArticleModel } from "@/lib/models/Article";

export const revalidate = 0;

async function getFounder(slug: string) {
  try {
    await connectDB();
    const f = await FounderModel.findOne({ slug }).lean() as any;
    if (!f) return null;
    return { ...f, id: f._id.toString() };
  } catch { return null; }
}

async function getOtherFounders(id: string) {
  try {
    await connectDB();
    const data = await FounderModel.find({ _id: { $ne: id } }).limit(4).lean() as any[];
    return data.map((f: any) => ({ ...f, id: f._id.toString() }));
  } catch { return []; }
}

async function getRelatedArticles(industry: string) {
  try {
    await connectDB();
    const data = await ArticleModel.find({ category: industry }).limit(2).lean() as any[];
    return data.map((a: any) => ({ ...a, id: a._id.toString() }));
  } catch { return []; }
}

async function getAllFounders() {
  try {
    await connectDB();
    const data = await FounderModel.find().sort({ rank: 1 }).lean() as any[];
    return data.map((f: any) => ({ ...f, id: f._id.toString() }));
  } catch { return []; }
}

export default async function FounderPage({ params }: { params: { slug: string } }) {
  const founder = await getFounder(params.slug);
  if (!founder) notFound();

  const [allFounders, relatedArticles] = await Promise.all([
    getAllFounders(),
    getRelatedArticles(founder.industry),
  ]);

  const idx = allFounders.findIndex((f: any) => f.slug === params.slug);
  const prev = allFounders[idx - 1];
  const next = allFounders[idx + 1];
  const others = allFounders.filter((f: any) => f.id !== founder.id).slice(0, 4);

  return (
    <div className="bg-brand-gray min-h-screen">
      <div className="bg-white border-b border-brand-border">
        <div className="container-wide py-3 flex items-center justify-between">
          <Link href="/founders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors">
            <ArrowLeft size={14} /> All Founders
          </Link>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {prev && <Link href={`/founders/${prev.slug}`} className="flex items-center gap-1 hover:text-brand-red transition-colors"><ArrowLeft size={12} /> {prev.name}</Link>}
            {prev && next && <span>·</span>}
            {next && <Link href={`/founders/${next.slug}`} className="flex items-center gap-1 hover:text-brand-red transition-colors">{next.name} <ArrowRight size={12} /></Link>}
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white border border-brand-border overflow-hidden">
              <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                {founder.avatar && <Image src={founder.avatar} alt={founder.name} fill className="object-cover object-top" priority />}
                {founder.rank && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-dark/80 px-3 py-1.5">
                    <Award size={12} className="text-brand-gold" />
                    <span className="text-white text-xs font-bold">#{founder.rank} Bangladesh</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-green-500 px-2 py-1 flex items-center gap-1">
                  <CheckCircle size={11} className="text-white" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider">Verified</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red bg-white/10 px-2 py-0.5">{founder.industry}</span>
                  <h1 className="font-serif text-2xl font-bold text-white mt-1 leading-tight">{founder.name}</h1>
                  <p className="text-gray-300 text-sm">{founder.title}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-5">
                <p className="text-gray-500 text-sm mb-4 border-l-2 border-brand-red pl-3 italic">{founder.bio?.slice(0, 120)}…</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: Building2, label: "Company", value: founder.company },
                    { icon: Calendar, label: "Founded", value: founder.founded },
                    { icon: MapPin, label: "Location", value: founder.location },
                    { icon: TrendingUp, label: "Industry", value: founder.industry },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-brand-gray border border-brand-border p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon size={12} className="text-brand-red" />
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">{label}</span>
                      </div>
                      <p className="font-bold text-sm text-brand-dark">{value}</p>
                    </div>
                  ))}
                </div>
                {founder.netWorth && (
                  <div className="bg-brand-dark text-white p-4 flex items-center justify-between mb-5">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider">Estimated Net Worth</p>
                      <p className="font-serif text-2xl font-bold text-brand-gold">{founder.netWorth}</p>
                    </div>
                    <TrendingUp size={28} className="text-brand-gold/30" />
                  </div>
                )}
                <div className="flex gap-2">
                  {founder.socialLinks?.twitter && <a href={founder.socialLinks.twitter} className="flex-1 flex items-center justify-center gap-2 py-2 border border-brand-border text-xs font-semibold text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors"><Twitter size={13} /> Twitter</a>}
                  {founder.socialLinks?.linkedin && <a href={founder.socialLinks.linkedin} className="flex-1 flex items-center justify-center gap-2 py-2 border border-brand-border text-xs font-semibold text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors"><Linkedin size={13} /> LinkedIn</a>}
                  {founder.socialLinks?.website && <a href={founder.socialLinks.website} className="flex-1 flex items-center justify-center gap-2 py-2 border border-brand-border text-xs font-semibold text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors"><Globe size={13} /> Web</a>}
                </div>
              </div>
            </div>

            {founder.achievements?.length > 0 && (
              <div className="bg-white border border-brand-border p-6">
                <div className="flex items-center gap-2 mb-5"><Award size={16} className="text-brand-red" /><h3 className="font-bold text-sm uppercase tracking-wider text-brand-dark">Recognitions</h3></div>
                <ul className="space-y-3">
                  {founder.achievements.map((ach: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="w-6 h-6 bg-brand-red/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-red transition-colors">
                        <span className="text-brand-red text-[10px] font-bold group-hover:text-white transition-colors">{i + 1}</span>
                      </div>
                      <span className="text-sm text-gray-600 leading-snug">{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {others.length > 0 && (
              <div className="bg-white border border-brand-border p-6">
                <div className="flex items-center gap-2 mb-4"><Users size={16} className="text-brand-red" /><h3 className="font-bold text-sm uppercase tracking-wider text-brand-dark">Other Founders</h3></div>
                <div className="space-y-3">
                  {others.map((f: any) => (
                    <Link key={f.id} href={`/founders/${f.slug}`} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {f.avatar && <Image src={f.avatar} alt={f.name} width={36} height={36} className="object-cover w-full h-full" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-dark group-hover:text-brand-red transition-colors truncate">{f.name}</p>
                        <p className="text-xs text-gray-400 truncate">{f.company}</p>
                      </div>
                      {f.rank && <span className="text-xs font-bold text-gray-300 ml-auto">#{f.rank}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-64 lg:h-80 overflow-hidden bg-gray-100">
              {founder.coverImage && <Image src={founder.coverImage} alt={founder.name} fill className="object-cover" priority />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <div className="flex items-center gap-2">
                  <span className="badge-red text-[10px]">{founder.industry}</span>
                  <span className="text-white/60 text-xs">·</span>
                  <span className="text-white/80 text-xs">Est. {founder.founded}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-white mt-1">{founder.company}</h2>
              </div>
            </div>

            <div className="bg-white border border-brand-border p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-1"><div className="w-1 h-6 bg-brand-red" /><span className="text-xs font-bold uppercase tracking-widest text-gray-400">About</span></div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-4">The Story of {founder.name}</h2>
              <p className="text-gray-600 leading-relaxed text-base mb-4">{founder.bio}</p>
              <p className="text-gray-600 leading-relaxed">As one of Bangladesh's most influential entrepreneurs, {founder.name} has consistently demonstrated that world-class innovation can emerge from emerging markets. Their work at {founder.company} has not only created significant economic value but has also inspired a new generation of Bangladeshi founders.</p>
            </div>

            <a href="/advertise" className="group flex items-center justify-between bg-brand-dark border border-white/10 px-6 py-4 hover:border-brand-red transition-colors">
              <div><p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-1">Advertisement</p><p className="text-white font-semibold text-sm">Advertise with Start-Up News</p><p className="text-gray-500 text-xs">Reach 2M+ Bangladeshi entrepreneurs & investors</p></div>
              <span className="hidden sm:block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2 group-hover:bg-red-700 transition-colors whitespace-nowrap flex-shrink-0">Get Started →</span>
            </a>

            {relatedArticles.length > 0 && (
              <div className="bg-white border border-brand-border p-6 lg:p-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-bold text-brand-dark">Related Articles</h2>
                  <Link href="/articles" className="text-xs text-brand-red font-semibold hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map((article: any) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-3 border border-gray-100 hover:border-brand-red p-3 transition-colors">
                      <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden bg-gray-100">
                        {article.coverImage && <Image src={article.coverImage} alt={article.title} fill className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">{article.category}</span>
                        <h4 className="text-sm font-semibold text-brand-dark group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">{article.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {prev ? (
                <Link href={`/founders/${prev.slug}`} className="group bg-white p-4 flex items-center gap-3 hover:border-brand-red border border-brand-border transition-colors">
                  <ArrowLeft size={16} className="text-gray-400 group-hover:text-brand-red transition-colors flex-shrink-0" />
                  <div className="min-w-0"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Previous</p><p className="font-semibold text-sm text-brand-dark group-hover:text-brand-red transition-colors truncate">{prev.name}</p></div>
                </Link>
              ) : <div />}
              {next && (
                <Link href={`/founders/${next.slug}`} className="group bg-white p-4 flex items-center justify-end gap-3 hover:border-brand-red border border-brand-border transition-colors text-right">
                  <div className="min-w-0"><p className="text-[10px] text-gray-400 uppercase tracking-wider">Next</p><p className="font-semibold text-sm text-brand-dark group-hover:text-brand-red transition-colors truncate">{next.name}</p></div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-brand-red transition-colors flex-shrink-0" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
