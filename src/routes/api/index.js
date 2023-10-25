const express = require("express");

const router = express.Router();

const exchangeRate = require("./exchange-rate");

router.use("/exchange", exchangeRate);

module.exports = router;
