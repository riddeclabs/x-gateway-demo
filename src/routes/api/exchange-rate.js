const axios = require("axios");
const config = require("config");
const express = require("express");

const router = express.Router();
const coreURL = config.get("coreURL");

// validate

router.get("/rate", async (req, res, next) => {
  const {
    amount, target, source, direction,
  } = req.query;

  try {
    const { data } = await axios.get(`${coreURL}/exchange/rate`, {
      params: {
        amount, source, target, direction,
      },
    });

    // exchangeRateSchema.parse(data);

    return res.status(200).json(data.data);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
