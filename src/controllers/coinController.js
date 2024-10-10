require("dotenv").config();
const Coin = require("../models/coinSchema");
const axios = require("axios");
const { deviationServices, cronService } = require("../services/coinService");

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
      vs_currencies: "usd",
      include_market_cap: true,
      include_24hr_change: true,
    },
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data[ids] && response.data[ids].usd_24h_change) {
      response.data[ids].usd_24h_change = parseFloat(
        response.data[ids].usd_24h_change.toFixed(2)
      );
    }

    const coinData = response.data[ids];

    const myData = {
      price: coinData.usd,
      market_cap: coinData.usd_market_cap,
      change: parseFloat(coinData.usd_24h_change.toFixed(2)),
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
      vs_currencies: "usd",
      include_market_cap: true,
      include_24hr_change: true,
      include_last_updated_at: true,
    },
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": process.env.API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    const coinData = response.data;
    const data = await cronService(coinData);
    return data.message;
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
