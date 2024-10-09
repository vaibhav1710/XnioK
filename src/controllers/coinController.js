require("dotenv").config();
const Coin = require("../models/coinSchema");
const axios = require("axios");
const { deviationServices } = require("../services/coinService");

async function getStat(req, res) {
  const { ids } = req.query; // Expecting coinId as a query parameter

  if (!ids) {
    return res
      .status(400)
      .json({ error: "Missing required query parameter: ids" });
  }

  const options = {
    method: "GET",
    url: "https://api.coingecko.com/api/v3/simple/price",
    params: {
      ids: ids,
      vs_currencies: "inr",
      include_market_cap: true,
      include_24hr_change: true,
    },
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-gX79EPPBzUHoHiL48tMxgkVZ",
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data[ids] && response.data[ids].inr_24h_change) {
      response.data[ids].inr_24h_change = parseFloat(
        response.data[ids].inr_24h_change.toFixed(2)
      );
    }

    const coinData = response.data[ids];

    const myData = {
      price: coinData.inr,
      market_cap: coinData.inr_market_cap,
      change: parseFloat(coinData.inr_24h_change.toFixed(2)),
    };
    return res.status(200).json(myData);
  } catch (error) {
    console.error("Error fetching coin stats:", error);

    // Handle the error case
    return res.status(500).json({
      error: "Failed to fetch coin stats",
      details: error.message,
    });
  }
}

async function getDeviation(req, res) {
  const { ids } = req.query; // Expecting coinId as a query parameter
  if (!ids) {
    return res
      .status(400)
      .json({ error: "Missing required query parameter: ids" });
  }

  try {
    const stdDev = await deviationServices(ids);
    if (stdDev == null) {
      res.status(404).send("Error calculating Deviation");
    } else {
      const obj = {
        deviation: stdDev,
      };
      res.status(200).json(obj);
    }
  } catch (error) {
    console.error("Error fetching deviation:", error);
  }
}

async function cronTask(coinId) {
  console.log(coinId);
  if (!coinId) {
    return res
      .status(400)
      .json({ error: "Missing required query parameter: coinIds" });
  }

  const options = {
    method: "GET",
    url: "https://api.coingecko.com/api/v3/simple/price",
    params: {
      ids: coinId, // e.g., 'bitcoin,ethereum,matic-network'
      vs_currencies: "inr",
      include_market_cap: true,
      include_24hr_change: true,
      include_last_updated_at: true,
    },
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-gX79EPPBzUHoHiL48tMxgkVZ",
    },
  };

  try {
    const response = await axios.request(options);
    const coinData = response.data;

    for (let [coinId, data] of Object.entries(coinData)) {
      const { inr, inr_market_cap, inr_24h_change, last_updated_at } = data;

      // Find the coin document by coinId (like 'bitcoin', 'ethereum', 'matic-network')
      let coin = await Coin.findOne({ coinId });

      if (!coin) {
        // If the coin document doesn't exist, create it
        coin = new Coin({
          coinId,
          price: inr,
          market_cap: inr_market_cap,
          inr_24h_change: inr_24h_change,
          last_updated: last_updated_at,
        });
      } else {
        // Update the fields
        coin.price = inr; // Latest price
        coin.market_cap = inr_market_cap;
        coin.usd_24h_change = parseFloat(inr_24h_change.toFixed(2)); // Keep 2 decimal places for change
        coin.last_updated = last_updated_at;
      }

      // Add the current price to the prices array (ensure it's capped at 100 prices)
      coin.prices.push({ price: inr });

      await coin.save();
    }
    return "Successfully Added";
  } catch (error) {
    console.error("Error fetching coin stats:", error);

    // Handle the error case
    return "Error Occured";
  }
}

module.exports = {
  getStat,
  getDeviation,
  cronTask,
};
