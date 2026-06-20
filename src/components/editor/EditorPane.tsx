import React, { useRef, useMemo } from 'react';
import { SquareDashedMousePointer, Clipboard, Upload } from 'lucide-react';

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  scrollRef: React.RefObject<HTMLTextAreaElement | HTMLDivElement | null>;
}

export function EditorPane({ value, onChange, scrollRef }: EditorPaneProps) {
  const linesContainerRef = useRef<HTMLDivElement>(null);

  const linesArray = useMemo(() => {
    const count = value.split('\n').length || 1;
    const totalLines = Math.max(20, count + 10);
    return Array.from({ length: totalLines }, (_, i) => i + 1);
  }, [value]);

  const handleSyncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (linesContainerRef.current) {
      linesContainerRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleSelectAll = () => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.select();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + text + value.substring(end);
        onChange(newValue);
        
        // Reset cursor position after React update
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + text.length;
          textarea.focus();
        }, 0);
      }
    } catch (err) {
      console.error('Failed to read clipboard text: ', err);
      alert("Clipboard access is restricted in this environment. Please use Ctrl+V or Cmd+V to paste.");
    }
  };

  const handleImport = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md,.txt,text/markdown,text/plain';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          onChange(content);
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  return (
    <section className="h-full flex flex-col bg-surface-container-lowest border-r border-outline-variant relative">
      {/* Editor Actions Bar */}
      <div className="h-9 flex-none flex items-center justify-between px-3 border-b border-outline-variant bg-surface-container-low">
        <span className="font-mono text-[11px] font-medium uppercase text-on-surface-variant tracking-wider">
          Markdown Editor
        </span>
        <div className="flex gap-2">
          <button 
            onClick={handleImport}
            className="px-2 py-1 font-label-sm text-xs font-medium text-primary hover:bg-primary-container/10 rounded transition-colors flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">Import</span>
          </button>
          <button 
            onClick={handleSelectAll}
            className="px-2 py-1 font-label-sm text-xs font-medium text-primary hover:bg-primary-container/10 rounded transition-colors flex items-center gap-1"
          >
            <SquareDashedMousePointer className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">Select All</span>
          </button>
          <button 
            onClick={handlePaste}
            className="px-2 py-1 font-label-sm text-xs font-medium text-primary hover:bg-primary-container/10 rounded transition-colors flex items-center gap-1"
          >
            <Clipboard className="w-3.5 h-3.5" /> 
            <span className="hidden sm:inline">Paste</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex overflow-hidden relative bg-background">
        {/* Line Numbers - Hidden overflow, controlled by textarea scroll limit */}
        <div 
          ref={linesContainerRef}
          className="w-10 flex-none bg-surface-container-low border-r border-outline-variant flex flex-col items-center pt-4 pb-32 text-outline select-none font-mono text-[11px] overflow-hidden"
        >
          {linesArray.map(i => (
            <div key={i} className="h-6 flex-none flex items-center justify-center w-full">
              {i}
            </div>
          ))}
        </div>
        
        {/* Text Area */}
        <div className="flex-1 relative">
          <textarea
            id="markdown-textarea"
            ref={scrollRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleSyncScroll}
            spellCheck={false}
            wrap="off"
            className="absolute inset-0 w-full h-full p-4 bg-transparent border-none focus:ring-0 focus:outline-none font-editor text-[15px] leading-6 text-on-background resize-none placeholder-outline-variant whitespace-pre"
            placeholder="# Start writing..."
          />
        </div>
      </div>
    </section>
  );
}
