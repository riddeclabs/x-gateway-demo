const path = require("path");

const compression = require("compression");
const express = require("express");

const app = express();

app.use(compression());

app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

app.use("/styles", express.static(path.join(__dirname, "../public/styles")));

const router = require("./routes");

app.use("/", router);

app.get("*", (_req, res) => {
  res.redirect("/not-found");
});

// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => res.render("error", {
  status: "500",
  message:
      "An internal server error occurred which prevented completing your request.",
}));

module.exports = app;
