const express = require("express");
const router = express.Router();

const {
  getStocks,
  buyStock,
  sellStock
} = require("../controllers/stockController");

const {
  protect
} = require("../middleware/authMiddleware");

router.get("/", protect, getStocks);

router.post("/buy", protect, buyStock);

router.post("/sell", protect, sellStock);

module.exports = router;