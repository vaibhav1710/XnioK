require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const coinRoute = require("./routes/coinRoute");
const { CronJob } = require("cron");
const { cronTask } = require("./controllers/coinController");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`DataBase Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const scheduledTime = process.env.CRON_SCHEDULE || "0 */2 * * *"; // Fallback to 2 hr if not provided

const job = CronJob.from({
  cronTime: scheduledTime,
  onTick: async function () {
    const ids = "bitcoin,ethereum,matic-network";
    const data = await cronTask(ids);
    console.log(data);
  },
  start: true,
  timeZone: "Asia/Kolkata",
});

app.get("/", (req, res) => {
  res.send("Hello World! From KoinX task");
});

app.use("/api", coinRoute);

module.exports = app;
