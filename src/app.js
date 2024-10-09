require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const coinRoute = require('./routes/coinRoute');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL); 
        console.log(`DataBase Connected: ${conn.connection.host}`); 
    } catch (error) {
        console.log(error);
    }
}

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World! From KoinX task');
});

app.use('/api', coinRoute);


module.exports = app;