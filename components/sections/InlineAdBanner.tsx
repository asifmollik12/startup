export default function InlineAdBanner({ label = "Advertisement" }: { label?: string }) {
  return (
    <div className="container-wide py-1">
      <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">{label}</p>
      <a
        href="/advertise"
        className="group relative flex items-center justify-between overflow-hidden bg-brand-dark border border-white/10 px-8 py-10 hover:border-brand-red transition-colors cursor-pointer w-full"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,16,46,0.1)_0%,_transparent_70%)] pointer-events-none" />
        {/* Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

        {/* Left */}
        <div className="relative flex items-center gap-5">
          <div className="w-10 h-10 bg-brand-red flex items-center justify-center flex-shrink-0">
            <span className="text-white font-serif font-bold text-sm">SUN</span>
          </div>
          <div>
            <p className="text-white font-serif font-bold text-base leading-tight">
              Grow Your Business with Start-Up News
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              Premium placements across Bangladesh&apos;s #1 startup media platform
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="relative hidden md:flex items-center gap-6">
          <div className="text-center">
            <p className="text-white font-bold text-sm">2M+</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-wider">Monthly Readers</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-sm">500+</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-wider">Founders</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-sm">1,200+</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-wider">Startups</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <span className="bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 group-hover:bg-red-700 transition-colors whitespace-nowrap">
            Advertise Now →
          </span>
        </div>
      </a>
    </div>
  );
}
