import { useState, useCallback } from 'react';
import { Toolbar, ThemeType } from './components/ui/Toolbar';
import { EditorPane } from './components/editor/EditorPane';
import { PreviewPane } from './components/preview/PreviewPane';
import { FloatingToolbar } from './components/ui/FloatingToolbar';
import { MobileSegmentedControl, ViewMode } from './components/ui/MobileSegmentedControl';
import { useScrollSync } from './hooks/useScrollSync';
import { downloadRawMarkdown, exportToPDF } from './utils/exporters';
import { DEFAULT_MARKDOWN } from './utils/constants';
import { cn } from './utils/cn';

export default function App() {
  const [content, setContent] = useState(DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState<ThemeType>('light');
  const [mobileView, setMobileView] = useState<ViewMode>('write');
  
  const { editorRef, previewRef } = useScrollSync();

  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(content).catch(console.error);
  }, [content]);

  const handleExportMD = useCallback(() => {
    downloadRawMarkdown(content, 'markflow-document.md');
  }, [content]);

  const handleExportPDF = useCallback(() => {
    exportToPDF('pdf-export-content', 'markflow-document.pdf');
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Toolbar 
        onCopyAll={handleCopyAll}
        onThemeChange={setTheme}
        currentTheme={theme}
      />
      
      <main className="flex-1 mt-[40px] relative overflow-hidden flex w-full">
        {/* Desktop Split View / Mobile Write View */}
        <div className={cn(
          "h-full w-full md:w-1/2 transition-transform duration-300 absolute md:relative inset-0",
          mobileView === 'write' ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <EditorPane 
            value={content} 
            onChange={setContent} 
            scrollRef={editorRef}
          />
        </div>

        {/* Desktop Split View / Mobile Preview View */}
        <div className={cn(
          "h-full w-full md:w-1/2 transition-transform duration-300 absolute md:relative inset-0",
          mobileView === 'preview' ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}>
          <PreviewPane 
            content={content} 
            scrollRef={previewRef}
          />
        </div>
      </main>

      {/* Floating Action Buttons */}
      <FloatingToolbar 
        onCopy={handleCopyAll}
        onExportMD={handleExportMD}
        onExportPDF={handleExportPDF}
        className={cn(
          "fixed right-6 z-[60] transition-all duration-300",
          mobileView === 'preview' 
            ? "bottom-24 md:bottom-6 flex" 
            : "bottom-6 hidden md:flex"
        )}
      />

      <MobileSegmentedControl 
        currentView={mobileView}
        onChange={setMobileView}
      />
    </div>
  );
}

