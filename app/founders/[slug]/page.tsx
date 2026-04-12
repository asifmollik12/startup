import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { founders, articles } from "@/lib/data";
import {
  MapPin, Building2, Calendar, ArrowLeft, Twitter,
  Linkedin, Globe, CheckCircle, TrendingUp, Award,
  ArrowRight, Users, Briefcase
} from "lucide-react";

export function generateStaticParams() {
  return founders.map((f) => ({ slug: f.slug }));
}

export default function FounderPage({ params }: { params: { slug: string } }) {
  const founder = founders.find((f) => f.slug === params.slug);
  if (!founder) notFound();

  const idx = founders.findIndex((f) => f.slug === params.slug);
  const prev = founders[idx - 1];
  const next = founders[idx + 1];

  const relatedArticles = articles.filter(
    (a) => a.category.toLowerCase() === founder.industry.toLowerCase()
  ).slice(0, 2);

  return (
    <div className="bg-brand-gray min-h-screen">

      {/* Back nav */}
      <div className="bg-white border-b border-brand-border">
        <div className="container-wide py-3 flex items-center justify-between">
          <Link href="/founders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-red transition-colors">
            <ArrowLeft size={14} /> All Founders
          </Link>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {prev && (
              <Link href={`/founders/${prev.slug}`} className="flex items-center gap-1 hover:text-brand-red transition-colors">
                <ArrowLeft size={12} /> {prev.name}
              </Link>
            )}
            {prev && next && <span>·</span>}
            {next && (
              <Link href={`/founders/${next.slug}`} className="flex items-center gap-1 hover:text-brand-red transition-colors">
                {next.name} <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Profile card */}
            <div className="bg-white border border-brand-border overflow-hidden">

              {/* Large square portrait */}
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={founder.avatar}
                  alt={founder.name}
                  fill
                  className="object-cover object-top"
                  priority
                />
                {/* Rank badge overlay */}
                {founder.rank && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-dark/80 backdrop-blur-sm px-3 py-1.5">
                    <Award size={12} className="text-brand-gold" />
                    <span className="text-white text-xs font-bold tracking-wider">#{founder.rank} Bangladesh</span>
                  </div>
                )}
                {/* Verified badge */}
                <div className="absolute top-4 right-4 bg-green-500 px-2 py-1 flex items-center gap-1">
                  <CheckCircle size={11} className="text-white" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider">Verified</span>
                </div>
                {/* Bottom gradient with name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red bg-white/10 px-2 py-0.5">{founder.industry}</span>
                  <h1 className="font-serif text-2xl font-bold text-white mt-1 leading-tight">{founder.name}</h1>
                  <p className="text-gray-300 text-sm">{founder.title}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-5">
                <p className="text-gray-500 text-sm mb-4 border-l-2 border-brand-red pl-3 italic">{founder.bio.slice(0, 100)}…</p>

                {/* Quick stats row */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-brand-gray border border-brand-border p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Building2 size={12} className="text-brand-red" />
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">Company</span>
                    </div>
                    <p className="font-bold text-sm text-white">{founder.company}</p>
                  </div>
                  <div className="bg-brand-gray border border-brand-border p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar size={12} className="text-brand-red" />
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">Founded</span>
                    </div>
                    <p className="font-bold text-sm text-white">{founder.founded}</p>
                  </div>
                  <div className="bg-brand-gray border border-brand-border p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MapPin size={12} className="text-brand-red" />
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">Location</span>
                    </div>
                    <p className="font-bold text-sm text-white">{founder.location}</p>
                  </div>
                  <div className="bg-brand-gray border border-brand-border p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp size={12} className="text-brand-red" />
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">Industry</span>
                    </div>
                    <p className="font-bold text-sm text-white">{founder.industry}</p>
                  </div>
                </div>

                {/* Net worth banner */}
                {founder.netWorth && (
                  <div className="bg-brand-dark text-white p-4 flex items-center justify-between mb-5">
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider">Estimated Net Worth</p>
                      <p className="font-serif text-2xl font-bold text-brand-gold">{founder.netWorth}</p>
                    </div>
                    <TrendingUp size={28} className="text-brand-gold/30" />
                  </div>
                )}

                {/* Social links */}
                <div className="flex gap-2">
                  {founder.socialLinks.twitter && (
                    <a href={founder.socialLinks.twitter} className="flex-1 flex items-center justify-center gap-2 py-2 border border-brand-border text-xs font-semibold text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors">
                      <Twitter size={13} /> Twitter
                    </a>
                  )}
                  {founder.socialLinks.linkedin && (
                    <a href={founder.socialLinks.linkedin} className="flex-1 flex items-center justify-center gap-2 py-2 border border-brand-border text-xs font-semibold text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors">
                      <Linkedin size={13} /> LinkedIn
                    </a>
                  )}
                  {founder.socialLinks.website && (
                    <a href={founder.socialLinks.website} className="flex-1 flex items-center justify-center gap-2 py-2 border border-brand-border text-xs font-semibold text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors">
                      <Globe size={13} /> Web
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements card */}
            <div className="bg-white border border-brand-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <Award size={16} className="text-brand-red" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">Recognitions</h3>
              </div>
              <ul className="space-y-3">
                {founder.achievements.map((ach, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 bg-brand-red/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand-red transition-colors">
                      <span className="text-brand-red text-[10px] font-bold group-hover:text-white transition-colors">{i + 1}</span>
                    </div>
                    <span className="text-sm text-gray-600 leading-snug">{ach}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other founders */}
            <div className="bg-white border border-brand-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-brand-red" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">Other Founders</h3>
              </div>
              <div className="space-y-3">
                {founders.filter((f) => f.id !== founder.id).slice(0, 4).map((f) => (
                  <Link key={f.id} href={`/founders/${f.slug}`} className="flex items-center gap-3 group">
                    <Image src={f.avatar} alt={f.name} width={36} height={36} className="rounded-full object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-dark group-hover:text-brand-red transition-colors truncate">{f.name}</p>
                      <p className="text-xs text-gray-400 truncate">{f.company}</p>
                    </div>
                    {f.rank && <span className="text-xs font-bold text-gray-300 ml-auto">#{f.rank}</span>}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Cover image */}
            <div className="relative h-64 lg:h-80 overflow-hidden">
              <Image src={founder.coverImage} alt={founder.name} fill className="object-cover" priority />
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

            {/* Bio */}
            <div className="bg-white border border-brand-border p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-6 bg-brand-red" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">About</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mb-4">The Story of {founder.name}</h2>
              <p className="text-gray-600 leading-relaxed text-base mb-4">{founder.bio}</p>
              <p className="text-gray-600 leading-relaxed">
                As one of Bangladesh&apos;s most influential entrepreneurs, {founder.name} has consistently demonstrated
                that world-class innovation can emerge from emerging markets. Their work at {founder.company} has not
                only created significant economic value but has also inspired a new generation of Bangladeshi founders
                to think bigger and bolder.
              </p>
            </div>

            {/* Ad banner */}
            <a href="/advertise"
              className="group relative flex items-center justify-between overflow-hidden bg-brand-dark border border-white/10 px-6 py-4 hover:border-brand-red transition-colors cursor-pointer">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(200,16,46,0.12)_0%,_transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <div className="relative">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-1">Advertisement</p>
                <p className="text-white font-semibold text-sm">Advertise with Start-Up News</p>
                <p className="text-gray-500 text-xs">Reach 2M+ Bangladeshi entrepreneurs & investors</p>
              </div>
              <span className="relative hidden sm:block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2 group-hover:bg-red-700 transition-colors whitespace-nowrap flex-shrink-0">
                Get Started →
              </span>
            </a>

            {/* Timeline */}
            <div className="bg-white border border-brand-border p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-brand-red" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Journey</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-white mb-6">Career Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-6">
                  {[
                    { year: founder.founded, label: `Founded ${founder.company}`, desc: `Launched ${founder.company} with a vision to transform ${founder.industry.toLowerCase()} in Bangladesh.` },
                    { year: String(parseInt(founder.founded) + 2), label: "First Major Milestone", desc: `Reached significant user growth and secured initial funding rounds.` },
                    { year: String(parseInt(founder.founded) + 4), label: "National Recognition", desc: `Recognized as one of Bangladesh's top innovators in the ${founder.industry} space.` },
                    { year: "2026", label: "Present Day", desc: `Continues to lead ${founder.company} as a dominant force in Bangladesh's startup ecosystem.` },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5 relative">
                      <div className="w-8 h-8 bg-brand-red flex items-center justify-center flex-shrink-0 z-10">
                        <span className="text-white text-[10px] font-bold">{item.year.slice(-2)}</span>
                      </div>
                      <div className="pb-2">
                        <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">{item.year}</span>
                        <h4 className="font-bold text-white text-sm mt-0.5">{item.label}</h4>
                        <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white border border-brand-border p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-6 bg-brand-red" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Coverage</span>
                </div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-serif text-xl font-bold text-white">Related Articles</h2>
                  <Link href="/articles" className="text-xs text-brand-red font-semibold hover:underline flex items-center gap-1">
                    View all <ArrowRight size={12} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedArticles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-3 border border-gray-100 hover:border-brand-red p-3 transition-colors">
                      <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden">
                        <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">{article.category}</span>
                        <h4 className="text-sm font-semibold text-brand-dark group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Next/Prev navigation */}
            <div className="grid grid-cols-2 gap-4">
              {prev ? (
                <Link href={`/founders/${prev.slug}`} className="group bg-white p-4 flex items-center gap-3 hover:border-brand-red border border-brand-border transition-colors">
                  <ArrowLeft size={16} className="text-gray-400 group-hover:text-brand-red transition-colors flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Previous</p>
                    <p className="font-semibold text-sm text-brand-dark group-hover:text-brand-red transition-colors truncate">{prev.name}</p>
                  </div>
                </Link>
              ) : <div />}
              {next && (
                <Link href={`/founders/${next.slug}`} className="group bg-white p-4 flex items-center justify-end gap-3 hover:border-brand-red border border-brand-border transition-colors text-right">
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Next</p>
                    <p className="font-semibold text-sm text-brand-dark group-hover:text-brand-red transition-colors truncate">{next.name}</p>
                  </div>
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
