"use client";
import { useState, useEffect } from "react";
import { Mail, Trash2, MailOpen, Loader2, RefreshCw } from "lucide-react";

type Msg = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Msg | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/messages")
      .then(r => r.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (msg: Msg) => {
    if (!msg.read) {
      await fetch(`/api/messages/${msg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setMessages(m => m.map(x => x._id === msg._id ? { ...x, read: true } : x));
    }
    setSelected({ ...msg, read: true });
  };

  const deleteMsg = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages(m => m.filter(x => x._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Messages
            {unread > 0 && <span className="bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{messages.length} total · {unread} unread</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded-lg transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={22} className="animate-spin text-gray-500" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <Mail size={40} className="mb-3 text-gray-700" />
          <p className="text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="flex gap-5 flex-1 min-h-0">
          {/* List */}
          <div className="w-80 flex-shrink-0 space-y-1 overflow-y-auto">
            {messages.map(msg => (
              <button key={msg._id} onClick={() => markRead(msg)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?._id === msg._id
                    ? "border-brand-red bg-brand-red/10"
                    : msg.read
                    ? "border-gray-800 bg-gray-900 hover:border-gray-700"
                    : "border-gray-700 bg-gray-800 hover:border-gray-600"
                }`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.read && <span className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />}
                    <span className={`text-sm font-semibold truncate ${msg.read ? "text-gray-300" : "text-white"}`}>{msg.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <p className={`text-xs truncate mb-0.5 ${msg.read ? "text-gray-500" : "text-gray-300"}`}>{msg.subject}</p>
                <p className="text-xs text-gray-600 truncate">{msg.email}</p>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="flex-1 min-w-0">
            {selected ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl h-full flex flex-col">
                <div className="px-6 py-5 border-b border-gray-800 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-white font-bold text-base mb-1">{selected.subject}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="font-semibold text-gray-300">{selected.name}</span>
                      <span>·</span>
                      <a href={`mailto:${selected.email}`} className="text-brand-red hover:underline">{selected.email}</a>
                      <span>·</span>
                      <span>{new Date(selected.createdAt).toLocaleString("en-BD", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                      className="flex items-center gap-1.5 text-xs bg-brand-red text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      <MailOpen size={12} /> Reply
                    </a>
                    <button onClick={() => deleteMsg(selected._id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="px-6 py-5 flex-1 overflow-y-auto">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <Mail size={40} className="mb-3" />
                <p className="text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
