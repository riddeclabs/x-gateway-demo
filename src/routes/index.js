const express = require("express");

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get("/", (req, res, next) => res.render("step-one"));

router.use("/not-found", (_req, res) => res.render("error", {
  status: "404",
  message: "The page you requested could not be found.",
}));

module.exports = router;
