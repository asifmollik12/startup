import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  positive?: boolean;
  color?: string;
}

export default function StatCard({ label, value, icon: Icon, change, positive, color = "bg-brand-red" }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {change && (
          <p className={`text-xs mt-1.5 font-medium ${positive ? "text-green-400" : "text-red-400"}`}>
            {positive ? "↑" : "↓"} {change}
          </p>
        )}
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  );
}
