require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractBillData = async (imageBuffer, mimeType) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const base64Image = imageBuffer.toString('base64');

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      },
      `Extract from this bill image and return ONLY valid JSON.
      No extra text. No explanation. Just JSON:
      {
        "shop": "shop name here",
        "amount": 0,
        "date": "date or null",
        "category": "Food/Shopping/Medical/Fuel/Bills/Other"
      }`
    ]);

    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);

  } catch (error) {
    if (error.message.includes('429')) {
      throw new Error('AI is busy. Please wait 1 minute and try again.');
    }
    throw new Error(error.message);
  }
};

module.exports = { extractBillData };