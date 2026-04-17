"use client";
import { useRef, useEffect, useCallback } from "react";
import { Bold, Italic, Underline, List, Link2, Heading2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write content...", rows = 4 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);

  // Sync value → DOM only on mount or external change
  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = useCallback((cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleInput = () => {
    if (!isComposing.current && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  };

  const btnClass = "p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors";

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden focus-within:border-brand-red transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-800 border-b border-gray-700">
        <button type="button" onClick={() => exec("bold")} className={btnClass} title="Bold"><Bold size={13} /></button>
        <button type="button" onClick={() => exec("italic")} className={btnClass} title="Italic"><Italic size={13} /></button>
        <button type="button" onClick={() => exec("underline")} className={btnClass} title="Underline"><Underline size={13} /></button>
        <div className="w-px h-4 bg-gray-700 mx-1" />
        <button type="button" onClick={() => exec("formatBlock", "h3")} className={btnClass} title="Heading"><Heading2 size={13} /></button>
        <button type="button" onClick={() => exec("insertUnorderedList")} className={btnClass} title="Bullet list"><List size={13} /></button>
        <button type="button" onClick={handleLink} className={btnClass} title="Insert link"><Link2 size={13} /></button>
        <div className="w-px h-4 bg-gray-700 mx-1" />
        <button type="button" onClick={() => exec("removeFormat")} className="p-1.5 text-gray-600 hover:text-gray-300 hover:bg-gray-700 rounded transition-colors text-[10px] font-bold" title="Clear formatting">Tx</button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; handleInput(); }}
        data-placeholder={placeholder}
        style={{ minHeight: `${rows * 1.6}rem` }}
        className="px-4 py-3 text-sm text-gray-200 bg-gray-900 focus:outline-none leading-relaxed
          [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_h3]:font-bold [&_h3]:text-white [&_h3]:text-base [&_h3]:mb-1
          [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-brand-red [&_a]:underline
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-600 empty:before:pointer-events-none"
      />
    </div>
  );
}
