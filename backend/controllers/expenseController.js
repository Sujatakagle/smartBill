const Expense = require("../models/Expense");
const { extractBillData, askExpenseAssistant } = require("../utils/gemini");

const moneyTotal = (items) =>
  items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

const addToGroup = (group, key, amount) => {
  const safeKey = key || "Other";
  group[safeKey] = (group[safeKey] || 0) + (Number(amount) || 0);
};

const sortGroup = (group) =>
  Object.entries(group)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({ name, amount }));

const startOfLocalDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const endOfLocalDay = (date) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const getWeekRange = (date = new Date()) => {
  const start = startOfLocalDay(date);
  start.setDate(start.getDate() - start.getDay());

  const end = endOfLocalDay(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
};

const isValidDate = (date) =>
  date instanceof Date && !Number.isNaN(date.getTime());

const buildAssistantSummary = (expenses) => {
  const byCategory = {};
  const byPaymentMethod = {};
  const byMerchant = {};
  const byMonth = {};

  expenses.forEach((expense) => {
    addToGroup(byCategory, expense.category, expense.amount);
    addToGroup(byPaymentMethod, expense.paymentMethod, expense.amount);
    addToGroup(byMerchant, expense.shop, expense.amount);

    const date = expense.date ? new Date(expense.date) : null;
    const monthKey =
      date && !Number.isNaN(date.getTime())
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        : "Unknown";
    addToGroup(byMonth, monthKey, expense.amount);
  });

  return {
    totalSpent: moneyTotal(expenses),
    transactionCount: expenses.length,
    averageTransaction:
      expenses.length > 0 ? moneyTotal(expenses) / expenses.length : 0,
    topCategories: sortGroup(byCategory).slice(0, 6),
    topPaymentMethods: sortGroup(byPaymentMethod).slice(0, 6),
    topMerchants: sortGroup(byMerchant).slice(0, 8),
    monthlyTotals: sortGroup(byMonth).slice(0, 12),
  };
};

/* ─────────────────────────────────────────────
   1. UPLOAD BILL (AI EXTRACTION)
──────────────────────────────────────────── */
exports.uploadBill = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const data = await extractBillData(req.file.buffer, req.file.mimetype);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: err.message || "AI extraction failed",
    });
  }
};

/* ─────────────────────────────────────────────
   2. ADD EXPENSE
──────────────────────────────────────────── */
exports.addExpense = async (req, res) => {
  try {
    const validCategories = ['Food', 'Shopping', 'Medical', 'Fuel', 'Bills', 'Other'];
    const validPaymentMethods = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Wallet', 'Other'];
    const parsedAmount = Number(req.body.amount);
    const shop =
      typeof req.body.shop === "string" && req.body.shop.trim()
        ? req.body.shop.trim()
        : "Unknown Merchant";
    const amount = Number.isFinite(parsedAmount) ? parsedAmount : 0;
    const category = validCategories.includes(req.body.category)
      ? req.body.category
      : "Other";
    const paymentMethod = validPaymentMethods.includes(req.body.paymentMethod)
      ? req.body.paymentMethod
      : "Other";
    const date = req.body.date ? new Date(req.body.date) : new Date();

    if (!shop || shop === "Unknown Merchant") {
      return res.status(400).json({
        msg: "Please enter the shop or merchant name before saving.",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ msg: "Valid amount is required" });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingExpense = await Expense.findOne({
      userId: req.user.id,
      amount,
      category,
      paymentMethod,
      $or: [
        { shop },
        { date: null },
        { date: { $gte: startOfDay, $lte: endOfDay } },
      ],
    });

    if (existingExpense) {
      return res.status(400).json({
        msg: "Duplicate expense detected",
      });
    }

    const expense = new Expense({
      shop,
      amount,
      category,
      paymentMethod,
      date,
      userId: req.user.id,
    });

    const saved = await expense.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};

/* ─────────────────────────────────────────────
   3. GET EXPENSES (PAGINATION)
──────────────────────────────────────────── */
exports.getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Expense.countDocuments({
      userId: req.user.id,
    });

    const expenses = await Expense.find({
      userId: req.user.id,
    })
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);

    res.json({
      expenses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const requestedYear = Number(req.query.year);
    const trendYear = Number.isInteger(requestedYear)
      ? requestedYear
      : now.getFullYear();
    const requestedMonth = Number(req.query.month);
    const trendMonth =
      Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12
        ? requestedMonth
        : null;
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextCurrentMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const { start: weekStart, end: weekEnd } = getWeekRange(now);

    const allExpenses = await Expense.find({ userId })
      .sort({ date: -1, _id: -1 })
      .lean();

    const datedExpenses = allExpenses
      .map((expense) => ({
        ...expense,
        parsedDate: expense.date ? new Date(expense.date) : null,
      }))
      .filter((expense) => isValidDate(expense.parsedDate));

    const dashboardExpenses = datedExpenses.filter(
      (expense) =>
        expense.parsedDate >= currentMonthStart &&
        expense.parsedDate < nextCurrentMonthStart
    );

    const totalSpent = moneyTotal(dashboardExpenses);
    const categoryCounts = {};
    const paymentMethodTotals = {};
    const merchantTotals = {};
    const dailyTotals = Array(7).fill(0);
    const monthlyData = Array(12).fill(0);
    const monthDays = trendMonth
      ? new Date(trendYear, trendMonth, 0).getDate()
      : 0;
    const selectedMonthDailyData = Array(monthDays).fill(0);
    const availableYearSet = new Set([now.getFullYear(), trendYear]);

    let highestExpense = 0;
    let thisMonthSpend = 0;

    dashboardExpenses.forEach((expense) => {
      const amount = Number(expense.amount) || 0;
      highestExpense = Math.max(highestExpense, amount);
      addToGroup(categoryCounts, expense.category, amount);
      addToGroup(paymentMethodTotals, expense.paymentMethod, amount);
      addToGroup(merchantTotals, expense.shop, amount);
    });

    datedExpenses.forEach((expense) => {
      const amount = Number(expense.amount) || 0;
      const date = expense.parsedDate;
      availableYearSet.add(date.getFullYear());

      if (date >= currentMonthStart && date < nextCurrentMonthStart) {
        thisMonthSpend += amount;
      }

      if (date >= weekStart && date <= weekEnd) {
        dailyTotals[date.getDay()] += amount;
      }

      if (date.getFullYear() === trendYear) {
        monthlyData[date.getMonth()] += amount;
      }

      if (
        trendMonth &&
        date.getFullYear() === trendYear &&
        date.getMonth() === trendMonth - 1
      ) {
        selectedMonthDailyData[date.getDate() - 1] += amount;
      }
    });

    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "N/A";

    const recentExpenses = dashboardExpenses
      .slice(0, 5)
      .map(({ parsedDate, ...expense }) => expense);
    const expenses = dashboardExpenses.map(({ parsedDate, ...expense }) => expense);
    const trendData = trendMonth ? selectedMonthDailyData : monthlyData;

    res.json({
      period: {
        type: "current_month",
        startDate: currentMonthStart,
        endDate: nextCurrentMonthStart,
      },
      summary: {
        totalSpent,
        transactionCount: dashboardExpenses.length,
        avgBill: dashboardExpenses.length ? totalSpent / dashboardExpenses.length : 0,
        topCategory,
        highestExpense,
        thisMonthSpend,
      },
      breakdown: {
        categoryCounts,
        paymentMethodTotals,
        merchantTotals,
      },
      weekly: {
        startDate: weekStart,
        endDate: weekEnd,
        dailyTotals,
      },
      yearly: {
        selectedYear: trendYear,
        availableYears: Array.from(availableYearSet).sort((a, b) => b - a),
        monthlyData,
      },
      trend: {
        type: trendMonth ? "monthly" : "yearly",
        selectedYear: trendYear,
        selectedMonth: trendMonth,
        title: trendMonth ? "Daily overview" : "Monthly overview",
        categories: trendMonth
          ? Array.from({ length: monthDays }, (_, index) => String(index + 1))
          : [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
        data: trendData,
      },
      recentExpenses,
      expenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ─────────────────────────────────────────────
   4. DELETE EXPENSE
──────────────────────────────────────────── */
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    if (expense.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ msg: "Expense removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/* ─────────────────────────────────────────────
   5. STATEMENT API (BANK STYLE + DOWNLOAD READY)
──────────────────────────────────────────── */
exports.getStatement = async (req, res) => {
  try {
    const userId = req.user.id;
    const type = req.query.type || "monthly";

    let startDate, endDate;

    /* ───── DATE ENGINE ───── */
    if (type === "monthly") {
      const year = parseInt(req.query.year) || new Date().getFullYear();
      const month = parseInt(req.query.month) || new Date().getMonth() + 1;

      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 1);
    } 
    
    else if (type === "yearly") {
      const year = parseInt(req.query.year) || new Date().getFullYear();

      startDate = new Date(year, 0, 1);
      endDate = new Date(year + 1, 0, 1);
    } 
    
    else if (type === "lastdays") {
      const days = parseInt(req.query.days) || 10;

      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    } 
    
    else if (type === "custom") {
      const { fromDate, toDate } = req.query;

      if (!fromDate || !toDate) {
        return res.status(400).json({
          msg: "fromDate and toDate required",
        });
      }

      startDate = new Date(fromDate);
      endDate = new Date(toDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    /* ───── FETCH ───── */
    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    /* ───── SUMMARY ───── */
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const byCategory = {};
    const byPaymentMethod = {};

    expenses.forEach((e) => {
      byCategory[e.category] =
        (byCategory[e.category] || 0) + e.amount;

      byPaymentMethod[e.paymentMethod || "Other"] =
        (byPaymentMethod[e.paymentMethod || "Other"] || 0) +
        e.amount;
    });

    res.json({
      type,
      period: { startDate, endDate },
      summary: {
        totalSpent,
        count: expenses.length,
        avgAmount: expenses.length ? totalSpent / expenses.length : 0,
      },
      breakdown: {
        byCategory,
        byPaymentMethod,
      },
      expenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* -------------------------------------------------------------
   6. SMARTBILL AI ASSISTANT
------------------------------------------------------------- */
exports.askAssistant = async (req, res) => {
  try {
    const question = String(req.body.question || "").trim();

    if (!question) {
      return res.status(400).json({ msg: "Question is required" });
    }

    if (question.length > 500) {
      return res.status(400).json({ msg: "Question is too long" });
    }

    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(200)
      .lean();

    if (!expenses.length) {
      return res.json({
        answer:
          "I don't see any expenses yet. Upload or add a few bills first, then I can tell you where you spent the most.",
        summary: buildAssistantSummary([]),
      });
    }

    const summary = buildAssistantSummary(expenses);
    const recentExpenses = expenses.slice(0, 30).map((expense) => ({
      shop: expense.shop,
      amount: expense.amount,
      category: expense.category,
      paymentMethod: expense.paymentMethod || "Other",
      date: expense.date,
    }));

    const answer = await askExpenseAssistant({
      question,
      summary,
      recentExpenses,
    });

    res.json({ answer, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: err.message || "AI assistant failed",
    });
  }
};
