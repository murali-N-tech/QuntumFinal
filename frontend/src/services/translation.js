import api from './api'; // Use our central api instance

/**
 * Translates text by sending it to our own backend.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The two-letter language code.
 * @returns {Promise<string>} The translated text.
 */
export const translateText = async (text, targetLang) => {
  if (targetLang === 'en' || !text) {
    return text;
  }
  
  try {
    // Call our new backend endpoint
    const response = await api.post('/translate', { text, targetLang });
    return response.data.translatedText;
  } catch (error) {
    console.error("Backend translation error:", error);
    return text; // Fallback to original text on error
  }
};