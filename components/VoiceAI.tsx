"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, X, Loader2, Volume2, Send } from "lucide-react";

type Message = { role: "user" | "ai"; text: string };

export default function VoiceAI() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript, loading]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice not supported. Use the text box below.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e: any) => {
      finalText = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setTranscript(finalText);
    };
    rec.onend = () => {
      setListening(false);
      if (finalText.trim()) sendMessage(finalText.trim());
      else setTranscript("");
    };
    rec.onerror = (e: any) => {
      setListening(false);
      setError(`Mic error: ${e.error}. Try typing instead.`);
    };
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
    setTranscript("");
    setError("");
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", text }]);
    setTranscript("");
    setTextInput("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const reply = data.reply || "I didn't get a response. Please try again.";
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      speak(reply);
    } catch (e: any) {
      const errMsg = "Sorry, something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: "ai", text: errMsg }]);
      setError(e.message);
    }
    setLoading(false);
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.05; utt.pitch = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };

  const suggestions = ["Who is the #1 founder?", "List fintech startups", "Latest articles", "Top ideas this month"];

  return (
    <>
      {/* Mic button */}
      <button onClick={() => setOpen(true)}
        className="relative p-2 text-gray-500 hover:text-brand-red transition-colors" aria-label="AI Assistant">
        <Mic size={17} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gray-900 rounded-full border border-white" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: "85vh", maxHeight: "600px" }}>

            {/* Header */}
            <div className="bg-brand-dark px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 bg-brand-red flex items-center justify-center rounded-full ${listening ? "animate-pulse" : ""}`}>
                  <Mic size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Start-Up News AI</p>
                  <p className="text-gray-400 text-[10px]">Powered by Alphainno</p>
                </div>
              </div>
              <button onClick={() => { setOpen(false); stopSpeaking(); stopListening(); }}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f5f5f0]">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mic size={28} className="text-brand-red" />
                  </div>
                  <p className="text-gray-700 text-sm font-semibold mb-1">Ask me anything</p>
                  <p className="text-gray-400 text-xs mb-4">About founders, startups, articles or ideas on this site</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="text-xs bg-white border border-brand-border px-3 py-1.5 text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors rounded-full">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-red text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-brand-border text-gray-700 rounded-2xl rounded-tl-sm shadow-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-brand-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                    <Loader2 size={14} className="text-brand-red animate-spin" />
                    <span className="text-xs text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}

              {transcript && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-2.5 text-sm bg-brand-red/10 text-brand-red rounded-2xl rounded-tr-sm italic border border-brand-red/20">
                    {transcript}...
                  </div>
                </div>
              )}

              {error && <p className="text-center text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-3 bg-white border-t border-brand-border flex-shrink-0 space-y-2">
              {/* Text input */}
              <div className="flex gap-2">
                <input
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage(textInput)}
                  placeholder="Type a question..."
                  className="flex-1 border border-brand-border px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors rounded-lg"
                />
                <button onClick={() => sendMessage(textInput)} disabled={!textInput.trim() || loading}
                  className="p-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40">
                  <Send size={15} />
                </button>
              </div>

              {/* Mic + stop speaking */}
              <div className="flex gap-2">
                <button onClick={listening ? stopListening : startListening} disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-lg ${
                    listening
                      ? "bg-red-50 border-2 border-brand-red text-brand-red"
                      : "bg-brand-dark text-white hover:bg-gray-800"
                  }`}>
                  {listening ? <><MicOff size={14} className="animate-pulse" /> Listening...</> : <><Mic size={14} /> Speak</>}
                </button>
                {speaking && (
                  <button onClick={stopSpeaking}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-brand-red border border-brand-red rounded-lg hover:bg-brand-red hover:text-white transition-colors">
                    <Volume2 size={13} /> Stop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
