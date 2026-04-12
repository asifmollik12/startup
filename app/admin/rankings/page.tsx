"use client";
import { useState } from "react";
import { founders as initialFounders } from "@/lib/data";
import { Founder } from "@/lib/types";
import { GripVertical, Trophy, Save } from "lucide-react";

export default function AdminRankings() {
  const [founders, setFounders] = useState<Founder[]>(
    [...initialFounders].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
  );
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragging(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOver(id);
  };

  const handleDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const list = [...founders];
    const fromIdx = list.findIndex((f) => f.id === dragging);
    const toIdx = list.findIndex((f) => f.id === targetId);
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    setFounders(list.map((f, i) => ({ ...f, rank: i + 1 })));
    setDragging(null);
    setDragOver(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Rankings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Drag to reorder founder rankings</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            saved ? "bg-green-600 text-white" : "bg-brand-red text-white hover:bg-red-700"
          }`}
        >
          <Save size={15} /> {saved ? "Saved!" : "Save Rankings"}
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-800 flex items-center gap-3">
          <Trophy size={15} className="text-amber-400" />
          <span className="text-sm font-semibold text-white">2026 Founder Rankings</span>
          <span className="text-xs text-gray-500 ml-auto">Drag rows to reorder</span>
        </div>
        <div className="divide-y divide-gray-800">
          {founders.map((founder, i) => (
            <div
              key={founder.id}
              draggable
              onDragStart={() => handleDragStart(founder.id)}
              onDragOver={(e) => handleDragOver(e, founder.id)}
              onDrop={() => handleDrop(founder.id)}
              onDragEnd={() => { setDragging(null); setDragOver(null); }}
              className={`flex items-center gap-4 px-5 py-4 cursor-grab active:cursor-grabbing transition-all ${
                dragging === founder.id ? "opacity-40" : ""
              } ${dragOver === founder.id ? "bg-brand-red/10 border-l-2 border-brand-red" : "hover:bg-gray-800/40"}`}
            >
              <GripVertical size={16} className="text-gray-600 flex-shrink-0" />
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm flex-shrink-0 ${
                i === 0 ? "bg-amber-500 text-white" :
                i === 1 ? "bg-gray-400 text-white" :
                i === 2 ? "bg-amber-700 text-white" :
                "bg-gray-800 text-gray-400"
              }`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{founder.name}</p>
                <p className="text-xs text-gray-500">{founder.title} · {founder.company}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-right flex-shrink-0">
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-medium">{founder.industry}</span>
                {founder.netWorth && <span className="text-xs font-bold text-amber-400">{founder.netWorth}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
