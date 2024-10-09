const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
    coinId: { 
        type: String, 
        required: true, 
        unique: true 
      },  
      price: { 
        type: Number, 
        required: true 
      },  
      market_cap: { 
        type: Number 
      },  
      usd_24h_change: { 
        type: Number 
      },
      last_updated: { 
        type: Date 
      },
  prices: {
    type: [
      {
        price: Number,
        timestamp: { type: Date, default: Date.now }
      }
    ],
    validate: [arrayLimit, '{PATH} exceeds the limit of 100']
  }
});

function arrayLimit(val) {
  return val.length <= 100;
}


coinSchema.pre('save', function (next) {
  if (this.prices.length > 100) {
    this.prices.shift(); 
  }
  next();
});

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
