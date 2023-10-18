const express = require("express");

const router = express.Router();

const address = require("./address");
const exchangeRate = require("./exchange-rate");

router.use("/exchange", exchangeRate);
router.use("/address", address);

module.exports = router;
