import React, { useEffect } from 'react';
import { CodeXml, RefreshCcw } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ThemeType = 'light' | 'dark' | 'theme-slate';

interface ToolbarProps {
  onCopyAll: () => void;
  onThemeChange: (theme: ThemeType) => void;
  currentTheme: ThemeType;
}

export function Toolbar({ onCopyAll, onThemeChange, currentTheme }: ToolbarProps) {
  useEffect(() => {
    // Apply theme to document element
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'theme-slate');
    if (currentTheme !== 'light') {
      root.classList.add(currentTheme);
    }
  }, [currentTheme]);

  return (
    <header className="fixed top-0 left-0 w-full h-[40px] z-50 flex items-center justify-between px-3 bg-background border-b border-outline-variant transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Custom logo mark */}
          <div className="w-6 h-6 bg-on-background rounded flex items-center justify-center text-background font-bold text-xs">
            MF
          </div>
          <span className="font-display text-lg text-primary font-semibold leading-none tracking-tight">MarkFlow</span>
        </div>
        <div className="h-4 w-px bg-outline-variant mx-2"></div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          <span className="font-label-sm text-xs font-medium text-on-surface-variant flex items-center gap-1">
            Live Syncing
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Selector */}
        <div className="flex bg-surface-container p-0.5 rounded-lg border border-outline-variant">
          {(['light', 'dark', 'theme-slate'] as ThemeType[]).map((theme) => {
            const isActive = currentTheme === theme;
            const label = theme === 'theme-slate' ? 'Slate' : theme.charAt(0).toUpperCase() + theme.slice(1);
            return (
              <button
                key={theme}
                onClick={() => onThemeChange(theme)}
                className={cn(
                  "px-3 py-1 font-label-sm text-xs font-medium rounded transition-all",
                  isActive 
                    ? "bg-background text-primary shadow-sm" 
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
        
        <div className="hidden sm:flex items-center gap-1">
          <button 
            className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
            title="View Code"
            onClick={onCopyAll}
          >
            <CodeXml className="w-5 h-5" />
          </button>
          <button 
            className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
            title="Refresh"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
