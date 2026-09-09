import { useEffect } from 'react';

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Store | ${title}`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
