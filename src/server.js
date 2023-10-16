require("dotenv").config({ path: ".env" });

const http = require("http");

const config = require("config");

// eslint-disable-next-line import/order
const app = require("./app");

const server = http.createServer(app);

server.listen(config.get("port"));
