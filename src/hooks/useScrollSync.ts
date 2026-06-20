import { useEffect, useRef } from 'react';

/**
 * useScrollSync Hook
 * 
 * Synchronizes the vertical scrolling position between two different elements (e.g. an editor and a preview panel).
 * It calculates the scroll percentage of the active element and applies that percentage to the passive element.
 * 
 * @returns {object} { editorRef, previewRef } - Refs to attach to the synchronized scroll containers.
 */
export function useScrollSync() {
  const editorRef = useRef<HTMLTextAreaElement | HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<'editor' | 'preview' | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    let editorTimeout: NodeJS.Timeout;
    let previewTimeout: NodeJS.Timeout;

    const handleEditorScroll = () => {
      if (isScrollingRef.current === 'preview') return;
      isScrollingRef.current = 'editor';
      
      const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      
      if (!isNaN(percentage)) {
        preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
      }

      // Reset scroll lock after a small delay
      clearTimeout(editorTimeout);
      editorTimeout = setTimeout(() => {
        isScrollingRef.current = null;
      }, 50);
    };

    const handlePreviewScroll = () => {
      if (isScrollingRef.current === 'editor') return;
      isScrollingRef.current = 'preview';

      const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      
      if (!isNaN(percentage)) {
        editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
      }

      clearTimeout(previewTimeout);
      previewTimeout = setTimeout(() => {
        isScrollingRef.current = null;
      }, 50);
    };

    editor.addEventListener('scroll', handleEditorScroll, { passive: true });
    preview.addEventListener('scroll', handlePreviewScroll, { passive: true });

    return () => {
      editor.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
      clearTimeout(editorTimeout);
      clearTimeout(previewTimeout);
    };
  }, []);

  return { editorRef, previewRef };
}
