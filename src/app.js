const path = require("path");

const compression = require("compression");
const express = require("express");
const logger = require("morgan");
const { ZodError } = require("zod");

const app = express();

app.use(compression());

app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

app.use("/styles", express.static(path.join(__dirname, "../public/styles")));

app.use("/scripts", express.static("node_modules/bootstrap/dist/js/"));

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

const router = require("./routes");

app.use("/", router);

app.get("*", (_req, res) => {
  res.redirect("/");
});

// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.render("error", {
      status: "422",
      message:
        "The request could not be processed due to invalid or missing data.",
    });
  }

  return res.render("error", {
    status: "500",
    message:
      "An internal server error occurred which prevented completing your request.",
  });
});

module.exports = app;
