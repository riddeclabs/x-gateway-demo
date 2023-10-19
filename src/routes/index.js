const axios = require("axios");
const config = require("config");
const express = require("express");

const baseCurrencies = require("../utils/baseCurrencies");
const currencies = require("../utils/currencies");

const router = express.Router();
const apiRouter = require("./api");

const coreURL = config.get("coreURL");

router.use("/api", apiRouter);

// eslint-disable-next-line no-unused-vars
router.get("/", async (req, res, next) => res.render("step-one", {
  baseCurrencies,
  currencies,
}));

router.post("/step-two", async (req, res, next) => {
  const { amount, currency } = req.body;
  const baseAmount = req.body["base-amount"];
  const baseCurrency = req.body["base-currency"];

  try {
    const { data } = await axios.post(
      `${coreURL}/channels`,
      { currency, customerId: "demo" },
      { headers: { "x-api-key": "740136ee-b2ff-4e8d-8e8c-d09b2554acc3" } },
    );

    const { address, qrCodeURL } = data.data;

    const { data: exchangeRate } = await axios.get(
      `${coreURL}/exchange/rate`,
      {
        params: {
          amount: 1,
          direction: "toSource",
          source: baseCurrency,
          target: currency,
        },
      },
    );

    return res.render("step-two", {
      address,
      amount,
      baseAmount,
      baseCurrency,
      currency,
      exchangeRate: exchangeRate.data,
      qrCodeURL,
    });
  } catch (error) {
    return next(error);
  }
});

// eslint-disable-next-line no-unused-vars
router.get("/step-two", (req, res, next) => res.render("step-two", {
  currencies,
}));

// eslint-disable-next-line no-unused-vars
router.get("/contact", (req, res, next) => res.render("contact", {
  currencies,
}));

router.use("/not-found", (_req, res) => res.render("error", {
  status: "404",
  message: "The page you requested could not be found.",
}));

module.exports = router;
