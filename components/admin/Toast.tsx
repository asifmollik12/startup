"use client";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface ToastProps {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="flex items-center gap-3 bg-gray-900 border border-green-500/40 text-white px-5 py-3.5 rounded-xl shadow-2xl shadow-black/40">
        <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <div className="absolute bottom-0 left-0 h-0.5 bg-green-500 rounded-full animate-[shrink_3s_linear_forwards]" style={{ width: "100%" }} />
      </div>
    </div>
  );
}
