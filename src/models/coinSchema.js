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
      inr_24h_change: { 
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
    
  }
});



coinSchema.pre('save', function(next) {
    // Ensure the prices array has only the latest 100 prices before saving
    if (this.prices.length > 25) {
      this.prices = this.prices.slice(-25); // Keep only the last 100 prices
    }
    next();
});
  

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
