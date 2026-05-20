const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  uploadBill,
  addExpense,
  getExpenses,
  getDashboard,
  deleteExpense,
  getStatement,
  askAssistant,
} = require("../controllers/expenseController");

/* ─────────────────────────────
   MAIN EXPENSE ROUTES (CRUD)
──────────────────────────── */
router.post("/upload", auth, upload.single("bill"), uploadBill);
router.post("/", auth, addExpense);
router.get("/dashboard", auth, getDashboard);
router.get("/", auth, getExpenses);
router.delete("/:id", auth, deleteExpense);

/* ─────────────────────────────
   BANK-STYLE STATEMENT API
   (REPLACES ALL REPORT ROUTES)
──────────────────────────── */
router.get("/statement", auth, getStatement);

/* -------------------------------------------------------------
   AI EXPENSE ASSISTANT
------------------------------------------------------------- */
router.post("/assistant", auth, askAssistant);

module.exports = router;
