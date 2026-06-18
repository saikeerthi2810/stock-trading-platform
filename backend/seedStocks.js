const mongoose = require("mongoose");
require("dotenv").config();

const Stock = require("./models/Stock");

mongoose.connect(process.env.MONGODB_URI);

const stocks = [
  {
    symbol: "AAPL",
    companyName: "Apple Inc",
    currentPrice: 195
  },
  {
    symbol: "GOOGL",
    companyName: "Alphabet Inc",
    currentPrice: 180
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corp",
    currentPrice: 450
  },
  {
    symbol: "AMZN",
    companyName: "Amazon",
    currentPrice: 210
  },
  {
    symbol: "TSLA",
    companyName: "Tesla",
    currentPrice: 320
  }
];

const seedStocks = async () => {
  try {
    await Stock.deleteMany();

    await Stock.insertMany(stocks);

    console.log("Stocks Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedStocks();