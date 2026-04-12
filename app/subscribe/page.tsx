import { Zap, BookOpen, TrendingUp } from "lucide-react";

const perks = [
  { icon: Zap, title: "Weekly Briefing", desc: "Top stories from Bangladesh's startup ecosystem, curated every Monday." },
  { icon: BookOpen, title: "Exclusive Reports", desc: "In-depth industry reports and founder interviews not available to free readers." },
  { icon: TrendingUp, title: "Early Rankings", desc: "Get our annual rankings before they go public." },
];

export default function SubscribePage() {
  return (
    <div className="section-pad">
      <div className="container-wide max-w-4xl">
        <div className="text-center mb-12">
          <span className="section-label">Newsletter</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-dark mt-2 mb-4">
            Stay Ahead of Bangladesh&apos;s<br />Business Pulse
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Join 50,000+ readers who get the best of Bangladeshi entrepreneurship delivered to their inbox.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-brand-border p-6 text-center">
              <div className="w-12 h-12 bg-brand-red/10 flex items-center justify-center mx-auto mb-4">
                <Icon size={20} className="text-brand-red" />
              </div>
              <h3 className="font-bold text-brand-dark mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-brand-dark text-white p-10 text-center">
          <h2 className="font-serif text-2xl font-bold mb-6">Subscribe for Free</h2>
          <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
            <button type="submit" className="bg-brand-red text-white px-8 py-3 font-semibold hover:bg-red-700 transition-colors">Subscribe</button>
          </form>
          <p className="text-gray-500 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}
