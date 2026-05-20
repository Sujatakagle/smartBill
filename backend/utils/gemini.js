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

const normalizeBillData = (data = {}) => {
  const validCategories = ['Food', 'Shopping', 'Medical', 'Fuel', 'Bills', 'Other'];
  const validPaymentMethods = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Wallet', 'Other'];
  const amount = Number(data.amount);

  return {
    shop: typeof data.shop === 'string' && data.shop.trim()
      ? data.shop.trim()
      : 'Unknown Merchant',
    amount: Number.isFinite(amount) ? amount : 0,
    date: data.date || null,
    category: validCategories.includes(data.category) ? data.category : 'Other',
    paymentMethod: validPaymentMethods.includes(data.paymentMethod)
      ? data.paymentMethod
      : 'Other',
  };
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

1. The "shop" must be the merchant/seller/payee, not the customer.
   NEVER use names or addresses from these buyer sections as shop:
   - BILL TO
   - SHIP TO
   - Customer
   - Recipient
   - Delivery address
   - Place of Supply

2. For invoices/e-commerce bills, choose shop using this priority:
   a) "Sold by", "Seller", "Merchant", "Supplier", "Store", "Restaurant", or brand/store header
   b) If "Sold by" has both a legal/person name and a trade/business name, prefer the trade/business/store name.
   c) If only a legal seller name is visible, use that.
   d) If no seller/payee is visible, use "Unknown Merchant".

3. E-commerce invoice example:
   If the bill says:
   BILL TO: Customer Name
   SHIP TO: Customer Name
   Sold by: LEGAL SELLER NAME
   Bright Star Store, 12 Market Road...
   then return:
   "shop": "Bright Star Store"
   Do NOT return "Customer Name".

4. For UPI/payment screenshots:
   - Use the receiver/person/shop name as "shop"
   - NOT the app name like PhonePe, GPay, Paytm

5. UPI example:
   If image shows:
   "Paid to Rahul"
   through PhonePe,
   then:
   "shop": "Rahul"

6. Identify payment method if visible:
- UPI
- Cash
- Credit Card
- Debit Card
- Wallet
- Other

7. Categorize intelligently:
- Food
- Shopping
- Medical
- Fuel
- Bills
- Other

8. Date:
   - Prefer Invoice Date or Bill Date.
   - If Invoice Date is missing, use Order Date or transaction date.
   - Return date as YYYY-MM-DD.

9. Amount:
   - Return the final payable total / grand total.
   - Do not return subtotal, taxable value, discount, or tax alone.

10. Never return null for shop, category, or paymentMethod.
   If shop is not visible, use "Unknown Merchant".
   If payment method is not visible, use "Other".
   If category is unclear, use "Other".

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
      return normalizeBillData(JSON.parse(cleaned));

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
    throw new Error('We could not scan this bill right now. Please try again in a moment.');
  }
  throw new Error('We could not read this bill clearly. Please upload a clearer photo or enter the details manually.');
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
    throw new Error("The assistant is taking a little longer than usual. Please try again in a moment.");
  }

  throw new Error("The assistant could not answer right now. Please try again.");
};

module.exports = { extractBillData, askExpenseAssistant };
