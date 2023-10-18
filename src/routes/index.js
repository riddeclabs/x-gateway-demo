const express = require("express");

const baseCurrencies = require("../utils/baseCurrencies");
const currencies = require("../utils/currencies");

const router = express.Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

// eslint-disable-next-line no-unused-vars
router.get("/", async (req, res, next) => res.render("step-one", {
  baseCurrencies,
  currencies,
}));

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
