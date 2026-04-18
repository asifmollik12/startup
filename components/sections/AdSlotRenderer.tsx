"use client";
import { useEffect, useRef } from "react";

// Properly executes script tags (required for Google AdSense)
export default function AdSlotRenderer({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const temp = document.createElement("div");
    temp.innerHTML = code;

    const nodes = Array.from(temp.childNodes);
    for (const node of nodes) {
      if (node.nodeName === "SCRIPT") {
        const script = document.createElement("script");
        const el = node as HTMLScriptElement;
        // Copy attributes
        Array.from(el.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
        script.textContent = el.textContent;
        ref.current.appendChild(script);
      } else {
        ref.current.appendChild(node.cloneNode(true));
      }
    }
  }, [code]);

  return <div ref={ref} className="w-full" />;
}
