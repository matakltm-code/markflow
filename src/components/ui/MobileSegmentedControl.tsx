import React from 'react';
import { Edit3, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ViewMode = 'write' | 'preview';

interface MobileSegmentedControlProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function MobileSegmentedControl({ currentView, onChange }: MobileSegmentedControlProps) {
  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm z-50 flex p-1 bg-surface-container/90 backdrop-blur-md rounded-xl border border-outline-variant shadow-lg transition-transform duration-300">
      <button
        onClick={() => onChange('write')}
        className={cn(
          "flex-1 py-2 flex items-center justify-center gap-2 rounded-lg transition-all font-label-sm text-sm font-medium",
          currentView === 'write' 
            ? "bg-primary text-on-primary shadow-md"
            : "text-on-surface-variant hover:bg-surface-container-highest"
        )}
      >
        <Edit3 className="w-4 h-4" />
        Write
      </button>
      <button
        onClick={() => onChange('preview')}
        className={cn(
          "flex-1 py-2 flex items-center justify-center gap-2 rounded-lg transition-all font-label-sm text-sm font-medium",
          currentView === 'preview' 
            ? "bg-primary text-on-primary shadow-md"
            : "text-on-surface-variant hover:bg-surface-container-highest"
        )}
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
    </nav>
  );
}
