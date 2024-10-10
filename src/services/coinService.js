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
      // console.log(prices);
      const stdDev = calculateStandardDeviation(prices); // Calculate standard deviation
      // console.log(stdDev);
      return stdDev; // Return the result
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching coin ${ids}:`, error);
    return { ids, standardDeviation: null, message: "Error fetching data" };
  }
}

async function cronService(coinData) {
  try {
    for (let [coinId, data] of Object.entries(coinData)) {
      const { usd, usd_market_cap, usd_24h_change, last_updated_at } = data;

      // Find the coin document by coinId (like 'bitcoin', 'ethereum', 'matic-network')
      let coin = await Coin.findOne({ coinId });

      if (!coin) {
        // If the coin document doesn't exist, create it
        coin = new Coin({
          coinId,
          price: usd,
          market_cap: usd_market_cap,
          usd_24h_change: usd_24h_change,
          last_updated: last_updated_at,
        });
      } else {
        // Update the fields
        coin.price = usd; // Latest price
        coin.market_cap = usd_market_cap;
        coin.usd_24h_change = parseFloat(usd_24h_change.toFixed(2)); // Keep 2 decimal places for change
        coin.last_updated = last_updated_at;
      }

      // Add the current price to the prices array (ensure it's capped at 100 prices)
      coin.prices.push({ price: usd });

      await coin.save();
    }

    return { message: "Successfully executed CRON task" };
  } catch (error) {
    console.log(error);
    return { message: "Error on CRON task" };
  }
}

module.exports = {
  deviationServices,
  cronService,
};
