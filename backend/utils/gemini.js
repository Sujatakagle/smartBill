require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getWorkingModel = () => {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
  ];

  return modelsToTry;
};

const extractBillData = async (imageBuffer, mimeType) => {
  const modelsToTry = getWorkingModel();

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const base64Image = imageBuffer.toString('base64');

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType
          }
        },
      `You are a bill and payment transaction reading assistant.

Extract data from this image carefully.

IMPORTANT RULES:

1. For UPI/payment screenshots:
   - Use the receiver/person/shop name as "shop"
   - NOT the app name like PhonePe, GPay, Paytm

2. Example:
   If image shows:
   "Paid to Rahul"
   through PhonePe,
   then:
   "shop": "Rahul"

3. Identify payment method if visible:
- UPI
- Cash
- Credit Card
- Debit Card
- Wallet
- Other

4. Categorize intelligently:
- Food
- Shopping
- Medical
- Fuel
- Bills
- Other

Return ONLY valid JSON.
No markdown.
No explanation.
No extra text.

{
  "shop": "receiver/shop/person name",
  "amount": 0,
  "date": "YYYY-MM-DD or null",
  "category": "Food/Shopping/Medical/Fuel/Bills/Other",
  "paymentMethod": "UPI/Cash/Credit Card/Debit Card/Wallet/Other"
}`
      ]);

      const text = result.response.text();
      const cleaned = text.replace(/```json|```/g, '').trim();
      console.log(`Success with model: ${modelName}`);
      return JSON.parse(cleaned);

    } catch (error) {
      console.error(`Model ${modelName} failed:`, error.message);
      lastError = error;

      // If rate limit — try next model
      if (error.message.includes('429')) {
        console.log(`Rate limit hit on ${modelName}, trying next...`);
        continue;
      }
      // If invalid key — stop immediately
      if (error.message.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your .env file.');
      }
      // Other errors — try next model
      continue;
    }
  }

  // All models failed
  if (lastError?.message.includes('429')) {
    throw new Error('All AI models are busy. Please wait 1-2 minutes and try again.');
  }
  throw new Error('AI extraction failed. Please try again.');
  console.log('error')
};

const askExpenseAssistant = async ({ question, summary, recentExpenses }) => {
  const modelsToTry = getWorkingModel();
  let lastError = null;

  const prompt = `You are Expenzoir, a helpful personal expense assistant.

Answer the user's question using ONLY the expense data below.
Be concise, practical, and include exact amounts when useful.
If the data is not enough, say what is missing and suggest what the user can ask next.
Currency is INR. Format amounts like Rs. 1,250.00.

Expense summary:
${JSON.stringify(summary, null, 2)}

Recent expenses:
${JSON.stringify(recentExpenses, null, 2)}

User question:
${question}`;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error(`Assistant model ${modelName} failed:`, error.message);
      lastError = error;

      if (error.message.includes("API key")) {
        throw new Error("Invalid Gemini API key. Please check your .env file.");
      }
    }
  }

  if (lastError?.message.includes("429")) {
    throw new Error("All AI models are busy. Please wait 1-2 minutes and try again.");
  }

  throw new Error("AI assistant failed. Please try again.");
};

module.exports = { extractBillData, askExpenseAssistant };
