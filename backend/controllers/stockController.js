const Transaction = require("../models/Transaction");
const Stock = require("../models/Stock");
const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({
        message: "Stock not found"
      });
    }

    const totalCost = stock.currentPrice * quantity;

    const user = await User.findById(req.user.id);

    if (user.balance < totalCost) {
      return res.status(400).json({
        message: "Insufficient balance"
      });
    }

    user.balance -= totalCost;
    await user.save();

    let portfolio = await Portfolio.findOne({
      user: user._id,
      stock: stock._id
    });

    if (portfolio) {
      portfolio.quantity += quantity;
      await portfolio.save();
    } else {
      portfolio = await Portfolio.create({
        user: user._id,
        stock: stock._id,
        quantity
      });
    }

    await Transaction.create({
      user: user._id,
      stock: stock._id,
      quantity,
      price: stock.currentPrice,
      type: "BUY"
    });

    res.json({
      message: "Stock purchased successfully",
      balance: user.balance,
      portfolio
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({
        message: "Stock not found"
      });
    }

    const portfolio = await Portfolio.findOne({
      user: req.user.id,
      stock: stockId
    });

    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({
        message: "Not enough shares to sell"
      });
    }

    portfolio.quantity -= quantity;

    if (portfolio.quantity === 0) {
      await Portfolio.deleteOne({
        _id: portfolio._id
      });
    } else {
      await portfolio.save();
    }

    const totalValue = stock.currentPrice * quantity;

    const user = await User.findById(req.user.id);

    user.balance += totalValue;
    await user.save();

    await Transaction.create({
      user: user._id,
      stock: stock._id,
      quantity,
      price: stock.currentPrice,
      type: "SELL"
    });

    res.json({
      message: "Stock sold successfully",
      balance: user.balance
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getStocks,
  buyStock,
  sellStock
};