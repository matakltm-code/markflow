import React from 'react';
import { Copy, Download, FileText } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FloatingToolbarProps {
  onCopy: () => void;
  onExportMD: () => void;
  onExportPDF: () => void;
  className?: string;
}

export function FloatingToolbar({ onCopy, onExportMD, onExportPDF, className }: FloatingToolbarProps) {
  return (
    <div className={cn("flex items-center gap-1 p-1 rounded-full shadow-xl bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/50", className)}>
      <button 
        onClick={onCopy}
        className="flex items-center gap-2 px-4 py-2 hover:bg-primary/5 rounded-full transition-all group"
      >
        <Copy className="w-[18px] h-[18px] text-primary group-hover:scale-110 transition-transform duration-200" />
        <span className="font-label-sm text-xs font-medium text-on-surface-variant hidden sm:inline">Copy</span>
      </button>
      
      <div className="w-px h-4 bg-outline-variant"></div>
      
      <button 
        onClick={onExportMD}
        className="flex items-center gap-2 px-4 py-2 hover:bg-primary/5 rounded-full transition-all group"
      >
        <Download className="w-[18px] h-[18px] text-primary group-hover:scale-110 transition-transform duration-200" />
        <span className="font-label-sm text-xs font-medium text-on-surface-variant hidden sm:inline">Export MD</span>
      </button>
      
      <button 
        onClick={onExportPDF}
        className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md group"
      >
        <FileText className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-200" />
        <span className="font-label-sm text-xs font-medium hidden sm:inline">Export PDF</span>
        <span className="font-label-sm text-xs font-medium sm:hidden">PDF</span>
      </button>
    </div>
  );
}
