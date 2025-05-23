const axios = require("axios");
const config = require("config");
const express = require("express");

const { validate } = require("../middleware/validate");
const baseCurrencies = require("../utils/baseCurrencies");
const currencies = require("../utils/currencies");
const { formatNumber } = require("../utils/formatter");

const router = express.Router();
const apiRouter = require("./api");
const {
  postAddressSchema,
  addressSchema,
  exchangeRateSchema,
} = require("./schema");

const coreURL = config.get("coreURL");
const apiKey = config.get("apiKey");
const baseURL = config.get("baseURL");

router.use("/api", apiRouter);

router.get("/", async (_req, res, next) => {
  try {
    const {
      data: { data: currencyList },
    } = await axios.get(`${coreURL}/currencies`, {
      headers: { "x-api-key": `${apiKey}` },
    });
    // TODO: display currencies based only on API response and remove hardcode
    res.render("step-one", {
      baseCurrencies: baseCurrencies.filter(
        (bc) => currencyList.find((c) => c.id === bc.currency)?.active,
      ),
      currencies: currencies.filter(
        (currency) => currencyList.find((c) => c.id === currency.currency)?.active,
      ),
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/step-two",
  validate(postAddressSchema),
  async (req, res, next) => {
    const {
      amount, baseAmount, baseCurrency, currency,
    } = req.body;

    if (["JPY", "INR", "KES", "UZS", "BDT"].includes(currency)) {
      return res.render("contact", {
        message:
          "Please contact our sales team to arrange a demo for peer-to-peer payments",
      });
    }

    if (["EUR", "GBP"].includes(currency)) {
      return res.render("contact", {
        message:
          "Please contact our sales team to arrange a demo for Onramp service",
      });
    }

    try {
      const { data } = await axios.post(
        `${coreURL}/channels`,
        { currency, customerId: "demo" },
        { headers: { "x-api-key": `${apiKey}` } },
      );

      addressSchema.parse(data);

      const { address, qrCodeURL } = data.data;

      const { data: exchangeRate } = await axios.get(
        `${coreURL}/exchange/rate`,
        {
          params: {
            amount: 1,
            direction: "toSource",
            source: baseCurrency,
            target: currency.includes("tUSD")
              ? currency.replace("tUSD", "USD")
              : currency,
          },
        },
      );

      exchangeRateSchema.parse(exchangeRate);

      return res.render("step-two", {
        address,
        amount,
        baseAmount: formatNumber(baseAmount, baseCurrency),
        baseCurrency,
        baseURL,
        currency,
        exchangeRate: formatNumber(exchangeRate.data, baseCurrency),
        qrCodeURL,
      });
    } catch (error) {
      return next(error);
    }
  },
);

router.get("/contact", (req, res) => res.render("contact"));

router.get("/expired", (req, res) => res.render("expired"));

router.use("/not-found", (_req, res) => res.render("error", {
  status: "404",
  message: "The page you requested could not be found.",
}));

module.exports = router;
