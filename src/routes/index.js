const express = require("express");

const currencies = require("../utils/currencies");

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get("/", (req, res, next) => res.render("step-one", {
  currencies,
}));

// eslint-disable-next-line no-unused-vars
router.get("/step-two", (req, res, next) => res.render("step-two", {
  currencies,
}));

router.use("/not-found", (_req, res) => res.render("error", {
  status: "404",
  message: "The page you requested could not be found.",
}));

module.exports = router;
