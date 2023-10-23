const axios = require("axios");
const config = require("config");
const express = require("express");

const { validate } = require("../../middleware/validate");

const { exchangeRateSchema, reqExchangeRateSchema } = require("./schema");

const router = express.Router();
const coreURL = config.get("coreURL");

router.get("/rate", validate(reqExchangeRateSchema), async (req, res, next) => {
  const {
    amount, direction, source, target,
  } = req.query;

  try {
    const { data } = await axios.get(`${coreURL}/exchange/rate`, {
      params: {
        amount,
        direction,
        source,
        target,
      },
    });

    exchangeRateSchema.parse(data);

    return res.status(200).json(data.data);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
