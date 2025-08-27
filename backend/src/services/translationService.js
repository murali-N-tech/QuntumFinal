const axios = require('axios');

const API_KEY = process.env.HUGGING_FACE_API_KEY;
const API_URL_BASE = 'https://api-inference.huggingface.co/models/';

// Map our app's language codes to specific Hugging Face model names
const modelMap = {
  hi: 'Helsinki-NLP/opus-mt-en-hi', // English to Hindi
  // You can find models for other languages (like 'te' and 'ta') on the Hugging Face Hub
};

const translateText = async (text, targetLang) => {
  const model = modelMap[targetLang];
  if (!model) {
    // If we don't have a model for the language, return the original text
    return text;
  }

  try {
    const response = await axios.post(
      `${API_URL_BASE}${model}`,
      { inputs: text },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );
    // The translated text is in the first element of the response array
    return response.data[0].translation_text;
  } catch (error) {
    console.error('Hugging Face API Error:', error.response ? error.response.data : error.message);
    // Return the original text if translation fails
    return text;
  }
};

module.exports = { translateText };