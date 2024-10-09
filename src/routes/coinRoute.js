const express = require('express');
const router = express.Router();
const {getStat, cronTask} = require("../controllers/coinController");

router.get('/stats',getStat);

module.exports = router;