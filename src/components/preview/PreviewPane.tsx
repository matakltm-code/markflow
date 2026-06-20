import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface PreviewPaneProps {
  content: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function PreviewPane({ content, scrollRef }: PreviewPaneProps) {
  return (
    <section className="h-full flex flex-col bg-background relative" id="preview-section">
      <div className="h-9 flex-none flex items-center px-4 border-b border-outline-variant bg-surface-container-low">
        <span className="font-mono text-[11px] font-medium uppercase text-on-surface-variant tracking-wider">
          Live Preview
        </span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full no-scrollbar"
      >
        <div id="pdf-export-content" className="max-w-[800px] w-full mx-auto p-4 sm:p-8 md:p-12">
          {content.trim() ? (
            <MarkdownRenderer content={content} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-outline mt-32">
              <span className="material-symbols-outlined text-4xl mb-4 opacity-50">visibility_off</span>
              <p className="font-body text-body">Nothing to preview</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
