"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export default function MarkdownView({ content, className = '' }: MarkdownViewProps) {
  return (
    <div className={`markdown-content leading-relaxed space-y-1.5 text-xs sm:text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-base sm:text-lg font-bold text-on-surface mt-2.5 mb-1.5 pb-1 border-b border-outline-variant/30" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-sm sm:text-base font-bold text-on-surface mt-2 mb-1 text-primary" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs sm:text-sm font-bold text-on-surface mt-1.5 mb-1 text-primary" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xs sm:text-sm font-semibold text-on-surface mt-1.5 mb-0.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-1.5 last:mb-0 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside pl-4 space-y-1 mb-2 text-on-surface" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside pl-4 space-y-1 mb-2 text-on-surface font-medium" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed pl-0.5" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-on-surface" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-on-surface-variant" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-3 border-primary pl-3 py-1 my-2 bg-surface-container/50 rounded-r-lg text-on-surface-variant italic" {...props} />
          ),
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 bg-surface-container-high text-primary font-mono text-[11px] sm:text-xs rounded-md border border-outline-variant/40" {...props} />
              );
            }
            return (
              <pre className="p-3 bg-surface-container-lowest text-on-surface font-mono text-xs rounded-xl border border-outline-variant my-2 overflow-x-auto">
                <code {...props} />
              </pre>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-2 rounded-xl border border-outline-variant">
              <table className="w-full text-left text-xs" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface font-bold" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="p-2 font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="p-2 border-b border-outline-variant/40" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary underline font-medium hover:text-secondary transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-3 border-outline-variant/40" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
