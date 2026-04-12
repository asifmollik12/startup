import { FileText, Users, Rocket, Lightbulb, TrendingUp, Eye, Star, Trophy } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { articles, founders, startups, ideas } from "@/lib/data";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const recentArticles = articles.slice(0, 5);
  const featuredCount = articles.filter((a) => a.featured).length;
  const totalVotes = ideas.reduce((sum, i) => sum + i.votes, 0);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Articles" value={articles.length} icon={FileText} change="2 this week" positive color="bg-blue-600" />
        <StatCard label="Founders" value={founders.length} icon={Users} change="1 new" positive color="bg-purple-600" />
        <StatCard label="Startups" value={startups.length} icon={Rocket} change="3 new" positive color="bg-brand-red" />
        <StatCard label="Idea Votes" value={totalVotes.toLocaleString()} icon={Lightbulb} change="12% this month" positive color="bg-amber-600" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Featured Articles" value={featuredCount} icon={Star} color="bg-green-600" />
        <StatCard label="Total Ideas" value={ideas.length} icon={TrendingUp} color="bg-pink-600" />
        <StatCard label="Ranked Founders" value={founders.filter((f) => f.rank).length} icon={Trophy} color="bg-orange-600" />
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Recent Articles</h2>
            <Link href="/admin/articles" className="text-xs text-brand-red hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {recentArticles.map((article) => (
              <div key={article.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{article.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] bg-brand-red/20 text-red-400 px-1.5 py-0.5 rounded font-medium">{article.category}</span>
                    <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
                {article.featured && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase flex-shrink-0">Featured</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Founders */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Top Founders</h2>
            <Link href="/admin/founders" className="text-xs text-brand-red hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {founders.slice(0, 5).map((founder) => (
              <div key={founder.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors">
                {founder.rank && (
                  <span className="text-xs font-bold text-gray-500 w-5 text-center">#{founder.rank}</span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{founder.name}</p>
                  <p className="text-xs text-gray-500">{founder.company} · {founder.industry}</p>
                </div>
                {founder.netWorth && (
                  <span className="text-xs font-bold text-amber-400">{founder.netWorth}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Startups & Ideas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Startups */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Startups</h2>
            <Link href="/admin/startups" className="text-xs text-brand-red hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {startups.slice(0, 5).map((startup) => (
              <div key={startup.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{startup.name}</p>
                  <p className="text-xs text-gray-500">{startup.industry} · {startup.location}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-medium">{startup.stage}</span>
                  {startup.funding && <p className="text-xs text-green-400 font-bold mt-0.5">{startup.funding}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ideas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Best Ideas</h2>
            <Link href="/admin/ideas" className="text-xs text-brand-red hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {ideas.map((idea) => (
              <div key={idea.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{idea.title}</p>
                    {idea.winner && <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase flex-shrink-0">Winner</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{idea.category} · by {idea.submittedBy}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">{idea.votes.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500">votes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
