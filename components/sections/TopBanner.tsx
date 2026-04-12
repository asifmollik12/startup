export default function TopBanner() {
  return (
    <div className="w-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.07)]">
      <div className="container-wide py-2 flex flex-col items-center justify-center">
        <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-2">Advertisement</p>
        <a
          href="/advertise"
          className="group relative w-full max-w-[970px] h-[90px] overflow-hidden flex items-center justify-between bg-brand-dark shadow-lg shadow-black/20 px-8 hover:shadow-xl hover:shadow-black/30 transition-all cursor-pointer"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-[#1a1a1a] to-brand-dark pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,_rgba(200,16,46,0.08)_0%,_transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.025] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Left — branding */}
          <div className="relative flex items-center gap-4 flex-shrink-0">
            <div className="w-10 h-10 bg-brand-red flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm tracking-wider">SUN</span>
            </div>
            <div>
              <p className="text-white font-serif font-bold text-base leading-tight">
                Advertise with Start-Up News
              </p>
              <p className="text-gray-500 text-xs mt-0.5">
                Bangladesh&apos;s #1 platform for entrepreneurs & investors
              </p>
            </div>
          </div>

          {/* Center — stats */}
          <div className="relative hidden lg:flex items-center gap-8">
            {[
              { value: "2M+", label: "Monthly Readers" },
              { value: "500+", label: "Founders" },
              { value: "1,200+", label: "Startups" },
              { value: "64", label: "Districts" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-white font-bold text-sm leading-none">{stat.value}</p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px h-6 bg-white/10" />}
              </div>
            ))}
          </div>

          {/* Right — CTA */}
          <div className="relative flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider">Premium Placement</p>
              <p className="text-white text-xs font-semibold">970 × 90 Leaderboard</p>
            </div>
            <span className="bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 group-hover:bg-red-700 transition-colors whitespace-nowrap">
              Book Now →
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
