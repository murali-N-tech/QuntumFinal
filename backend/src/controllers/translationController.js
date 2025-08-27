const { translateText } = require('../services/translationService');

const handleTranslation = async (req, res, next) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
      return res.status(400).json({ message: 'Text and target language are required.' });
    }
    const translatedText = await translateText(text, targetLang);
    res.json({ translatedText });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleTranslation };