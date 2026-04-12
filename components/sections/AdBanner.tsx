interface AdBannerProps {
  variant?: "leaderboard" | "rectangle" | "sidebar";
  label?: string;
}

export default function AdBanner({ variant = "leaderboard", label = "Advertisement" }: AdBannerProps) {
  if (variant === "leaderboard") {
    return (
      <div className="w-full bg-brand-gray border-y border-brand-border py-3">
        <div className="container-wide">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</span>
            <div className="w-full max-w-[728px] h-[90px] bg-white border border-brand-border relative overflow-hidden flex items-center justify-center group cursor-pointer hover:border-brand-red transition-colors">
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-gray-900 to-brand-dark" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,16,46,0.15)_0%,_transparent_70%)]" />

              {/* Ad content */}
              <div className="relative flex items-center justify-between w-full px-8">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-brand-red flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-serif font-bold text-lg">BD</span>
                  </div>
                  <div>
                    <p className="text-white font-serif font-bold text-lg leading-tight">Grow Your Business in Bangladesh</p>
                    <p className="text-gray-400 text-xs mt-0.5">Reach 2M+ entrepreneurs, founders & investors</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">2M+</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">Readers</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">500+</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">Founders</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <a
                    href="/advertise"
                    className="bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-red-700 transition-colors whitespace-nowrap"
                  >
                    Advertise Now
                  </a>
                </div>
              </div>

              {/* Subtle animated shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "rectangle") {
    return (
      <div className="w-full">
        <span className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">{label}</span>
        <div className="w-full h-[250px] bg-white border border-brand-border relative overflow-hidden flex items-center justify-center group cursor-pointer hover:border-brand-red transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-gray-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.2)_0%,_transparent_60%)]" />
          <div className="relative text-center px-6">
            <div className="w-10 h-10 bg-brand-red flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-serif font-bold">BD</span>
            </div>
            <p className="text-white font-serif font-bold text-xl mb-1">Advertise Here</p>
            <p className="text-gray-400 text-xs mb-4">300 × 250 · Premium Placement</p>
            <a href="/advertise"
              className="inline-block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2 hover:bg-red-700 transition-colors">
              Get Started
            </a>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </div>
      </div>
    );
  }

  // sidebar
  return (
    <div className="w-full">
      <span className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</span>
      <div className="w-full h-[600px] bg-white border border-brand-border relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer hover:border-brand-red transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-gray-900 to-brand-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,16,46,0.15)_0%,_transparent_70%)]" />
        <div className="relative text-center px-6">
          <div className="w-12 h-12 bg-brand-red flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-serif font-bold text-lg">BD</span>
          </div>
          <p className="text-white font-serif font-bold text-2xl mb-2 leading-tight">Your Brand<br />Here</p>
          <p className="text-gray-400 text-xs mb-2">160 × 600 · Skyscraper</p>
          <p className="text-gray-500 text-xs mb-6">Reach Bangladesh&apos;s top entrepreneurs & investors</p>
          <a href="/advertise"
            className="inline-block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-red-700 transition-colors">
            Advertise
          </a>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>
    </div>
  );
}
