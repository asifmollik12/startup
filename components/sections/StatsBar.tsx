const stats = [
  { value: "500+", label: "Founders Profiled" },
  { value: "1,200+", label: "Startups Listed" },
  { value: "2M+", label: "Monthly Readers" },
  { value: "64", label: "Districts Covered" },
];

export default function StatsBar() {
  return (
    <div className="bg-brand-gray border-y border-brand-border py-8">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-brand-border">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-6">
              <div className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1 uppercase tracking-[0.15em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
