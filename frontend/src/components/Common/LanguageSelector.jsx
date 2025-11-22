import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 p-2 hover:bg-dark-border rounded-lg transition">
        <Globe size={20} />
        <span className="text-2xl">{currentLanguage.flag}</span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full px-4 py-2 text-left hover:bg-dark-border flex items-center gap-3 ${
              i18n.language === lang.code ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
