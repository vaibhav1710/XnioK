const express = require("express");
const router = express.Router();
const { getStat, getDeviation } = require("../controllers/coinController");

router.get("/stats", getStat);
router.get("/deviation", getDeviation);

module.exports = router;
