import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Maximize2, Minimize2 } from 'lucide-react';

interface MermaidViewerProps {
  code: string;
}

export function MermaidViewer({ code }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [id] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        fontFamily: 'Inter, sans-serif',
      },
      securityLevel: 'loose',
    });

    const renderGraph = async () => {
      try {
        if (containerRef.current) {
          const { svg } = await mermaid.render(id, code);
          setSvgContent(svg);
        }
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        setSvgContent(`<div class="text-error text-sm font-mono p-4 border border-error-container bg-error-container/10 rounded">Failed to render diagram</div>`);
      }
    };

    renderGraph();
  }, [code, id]);

  return (
    <>
      <div className="my-6 p-6 bg-surface-container-low border border-outline-variant rounded-lg relative group overflow-hidden">
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant transition-colors"
            title="View Fullscreen"
          >
            <Maximize2 className="w-[18px] h-[18px]" />
          </button>
        </div>
        <div 
          ref={containerRef}
          className="flex items-center justify-center py-4 w-full overflow-x-auto" 
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        <div className="mt-4 pt-3 border-t border-outline-variant flex justify-center">
          <span className="font-mono-label text-[10px] text-outline uppercase tracking-widest">Mermaid Diagram</span>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur flex items-center justify-center p-8">
          <button 
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2 bg-surface-container hover:bg-surface-container-highest rounded-full text-on-surface transition-colors"
          >
            <Minimize2 className="w-6 h-6" />
          </button>
          <div 
            className="w-full h-full max-w-5xl max-h-full flex items-center justify-center pointer-events-auto overflow-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )}
    </>
  );
}
