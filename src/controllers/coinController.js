require("dotenv").config();
const Coin = require("../models/coinSchema");
const axios = require("axios");

async function getStat(req,res){
    const { ids } = req.query; // Expecting coinId as a query parameter

  if (!ids) {
    return res.status(400).json({ error: 'Missing required query parameter: coinId' });
  }

  const options = {
    method: 'GET',
    url: 'https://api.coingecko.com/api/v3/simple/price',
    params: {
      ids: ids,
      vs_currencies: 'inr',
      include_market_cap: true,
      include_24hr_change: true,
    },
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': 'CG-gX79EPPBzUHoHiL48tMxgkVZ'
    }
  };

//   {
//     "bitcoin": {
//       "inr": 5144409,
//       "inr_market_cap": 101783361215534.11,
//       "inr_24h_change": -0.9925177548904197
//     }
//   }

  try {
    const response = await axios.request(options);
    if (response.data[ids] && response.data[ids].inr_24h_change) {
        response.data[ids].inr_24h_change = parseFloat(response.data[ids].inr_24h_change.toFixed(2));
    }

    const coinData = response.data[ids];
    
    const myData = {
      price: coinData.inr,
      market_cap: coinData.inr_market_cap,
      change: parseFloat(coinData.inr_24h_change.toFixed(2))
    };
    return res.status(200).json(myData);
  } catch (error) {
    console.error('Error fetching coin stats:', error);
    
    // Handle the error case
    return res.status(500).json({
      error: 'Failed to fetch coin stats',
      details: error.message
    });
  }
}




module.exports = {
    getStat
}