import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ar from './locales/ar.json';
import en from './locales/en.json';

export const supportedLanguages = ['ar', 'en'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: 'ar',
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
  });

function applyDirection(lang: string): void {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
}

applyDirection(i18n.language);

i18n.on('languageChanged', applyDirection);

export default i18n;
