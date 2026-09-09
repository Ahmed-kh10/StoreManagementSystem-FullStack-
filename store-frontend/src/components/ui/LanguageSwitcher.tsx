import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectLanguage(code: string) {
    i18n.changeLanguage(code);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-muted hover:text-text transition-colors border border-border rounded-sm px-2.5 py-1.5"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe size={16} />
        <span className="text-xs font-body font-medium uppercase">
          {i18n.language}
        </span>
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-40 bg-surface border border-border rounded-sm shadow-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-body text-text hover:bg-bg transition-colors"
            >
              {lang.label}
              {i18n.language === lang.code && (
                <Check size={14} className="text-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
