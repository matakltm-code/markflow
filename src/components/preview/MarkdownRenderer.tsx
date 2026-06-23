import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { MermaidViewer } from './MermaidViewer';
import { Copy } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MarkdownRendererProps {
  content: string;
}

/**
 * MarkdownRenderer
 * 
 * A robust Markdown to React component renderer. It uses `react-markdown` 
 * to parse GitHub Flavored Markdown (GFM) and raw HTML. 
 * Intercepts code blocks to render specialized viewers like Mermaid.js graphs.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="font-display text-4xl font-semibold text-primary mb-6 border-b border-outline-variant pb-2 leading-tight tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-headline text-2xl font-semibold text-on-surface mb-4 mt-8 leading-snug tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-headline text-xl font-medium text-on-surface mb-3 mt-6">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="font-body text-base text-on-surface-variant mb-6 leading-relaxed">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc space-y-2 mb-8 ml-4 pl-4 marker:text-primary text-on-surface-variant text-base">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal space-y-2 mb-8 ml-4 pl-4 marker:text-primary text-on-surface-variant text-base">
        {children}
      </ol>
    ),
    li: ({ children, className }) => {
      // Standard list items get a custom bullet if they are under a ul
      return (
        <li className={cn("text-body text-on-surface-variant", className)}>
          {children}
        </li>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code({ className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const isMermaid = match && match[1] === 'mermaid';
      const isInline = !className && !String(children).includes('\n');

      if (!isInline && isMermaid) {
        return <MermaidViewer code={String(children).replace(/\n$/, '')} />;
      }

      const lang = match ? match[1] : 'text';

      if (!isInline) {
        return (
          <div className="bg-surface-container-highest rounded-lg overflow-hidden border border-outline-variant my-6">
            <div className="px-4 py-2 bg-on-background/5 flex justify-between items-center">
              <span className="font-mono-label text-[10px] text-outline uppercase tracking-widest">{lang}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(String(children))}
                className="hover:bg-on-background/10 p-1 rounded transition-colors text-outline"
                title="Copy code"
              >
                <Copy className="w-[14px] h-[14px]" />
              </button>
            </div>
            <pre className="p-4 font-mono text-sm text-primary-container overflow-x-auto">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          </div>
        );
      }

      return (
        <code className="bg-surface-container font-mono text-[0.9em] text-tertiary px-1 py-0.5 rounded" {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/50 pl-4 italic text-on-surface-variant my-6">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-8 w-full">
        <table className="w-full border-collapse text-left text-sm whitespace-nowrap">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-surface-container-low border-b-2 border-outline-variant">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y border-outline-variant">{children}</tbody>,
    tr: ({ children }) => <tr className="hover:bg-surface-container/50 transition-colors">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-3 font-medium text-on-surface">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 text-on-surface-variant">{children}</td>,
    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="max-w-full h-auto rounded-lg border border-outline-variant my-6" />
    )
  };

  return (
    <div className="prose prose-slate max-w-none w-full pb-32">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
