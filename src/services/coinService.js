const Coin = require("../models/coinSchema");
const { calculateStandardDeviation } = require("../utils/standardDeviation");

async function deviationServices(ids) {
  try {
    const coin = await Coin.findOne({ coinId: ids.trim() }); // Fetch the coin document by ID
    if (coin) {
      // Get the latest 100 prices or fewer if less than 100 exist
      const prices = coin.prices
        .slice(-100)
        .map((priceEntry) => priceEntry.price);
      console.log(prices);
      const stdDev = calculateStandardDeviation(prices); // Calculate standard deviation
      console.log(stdDev);
      return stdDev; // Return the result
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching coin ${ids}:`, error);
    return { ids, standardDeviation: null, message: "Error fetching data" };
  }
}

module.exports = {
  deviationServices,
};
