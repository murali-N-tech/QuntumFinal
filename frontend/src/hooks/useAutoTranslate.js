import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../services/translation';

const useAutoTranslate = (originalText) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (language === 'en' || !originalText) {
      setTranslatedText(originalText);
      return;
    }

    let isMounted = true;
    const doTranslate = async () => {
      setIsTranslating(true);
      const result = await translateText(originalText, language);
      if (isMounted) {
        setTranslatedText(result);
        setIsTranslating(false);
      }
    };

    doTranslate();
    return () => { isMounted = false; };
  }, [originalText, language]);

  return { translatedText, isTranslating };
};

export default useAutoTranslate;