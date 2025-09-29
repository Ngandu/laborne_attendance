import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Language, TranslationKeys, translations } from '../locales';

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys) => string;
  availableLanguages: { code: Language; name: string }[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setCurrentLanguage] = useState<Language>('en');

  // Available languages list
  const availableLanguages = [
    { code: 'en' as Language, name: 'English' },
    { code: 'fr' as Language, name: 'Français' },
  ];

  const setLanguage = (newLanguage: Language) => {
    setCurrentLanguage(newLanguage);
  };

  // Translation function
  const t = (key: TranslationKeys): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    availableLanguages,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};