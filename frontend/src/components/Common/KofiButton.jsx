import React from 'react';
import { Coffee, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const KofiButton = ({ variant = 'default' }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    window.open('https://ko-fi.com/koalitos', '_blank');
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 z-50 animate-pulse hover:animate-none"
        title={t('support.kofi')}
      >
        <Coffee size={20} />
        <span className="font-semibold">Ko-fi</span>
        <Heart size={16} className="animate-bounce" />
      </button>
    );
  }

  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <Coffee size={18} />
        <span className="font-semibold text-sm">{t('support.kofi')}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
    >
      <Coffee size={18} />
      <span className="font-semibold">{t('support.kofi')}</span>
    </button>
  );
};

export default KofiButton;
